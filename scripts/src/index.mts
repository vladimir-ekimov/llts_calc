import {InfluxDB, HttpError, Point} from '@influxdata/influxdb-client'
import {OrgsAPI, BucketsAPI} from '@influxdata/influxdb-client-apis'

const INFLUXDB_URL = process.env.INFLUXDB_URL
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN
const INFLUXDB_ORG = process.env.INFLUXDB_ORG
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET

if (!INFLUXDB_URL || !INFLUXDB_TOKEN || !INFLUXDB_ORG || !INFLUXDB_BUCKET) {
    throw new Error('Missing INFLUXDB CONFIG ENV VARS') //FIXME: Find a better way to write this
}

const influxDB = new InfluxDB({url: INFLUXDB_URL, token: INFLUXDB_TOKEN})
const orgsAPI = new OrgsAPI(influxDB)
const bucketsAPI = new BucketsAPI(influxDB)

const influxOrgID = await getOrgId() as string // Cannot be undefined
await recreateBucket(influxOrgID, INFLUXDB_BUCKET)

//TODO: Parameterize
const start = new Date('2022-10-13T00:00:00.000Z')
const num_of_days = 120
const soft_min = 80
const soft_max = 140
let baseline = 100
function getAmplitude() {
    return randomNumber(0.0005, 0.05)
}
let amplitude = getAmplitude()
let direction = Math.random() < 0.5 ? -1 : 1

console.log('*** LOAD DATA SCRIPT')
const t1 = new Date()
for (let i=0; i < num_of_days; i++) {
    console.log(`... Writing data for: ${start.toISOString().split('T')[0]}`)
    await writePointsForUTCDate(influxDB, influxOrgID, INFLUXDB_BUCKET, start)
}
const t2 = new Date()
console.log(`*** It took ${((t2.getTime() - t1.getTime()) / 1000)} seconds to fill the data`)

async function getOrgId(): Promise<string> {
    console.log(`Attempting to find default organization by name: "${INFLUXDB_ORG}"`)
    const organizations = await orgsAPI.getOrgs({org: INFLUXDB_ORG})
    if (!organizations || !organizations.orgs || !organizations.orgs.length) {
        throw new Error(`No organization named "${INFLUXDB_ORG}" found!`)
    }
    const orgID = organizations.orgs[0].id as string
    console.log(`Using organization "${INFLUXDB_ORG}" identified by "${orgID}"`)
    return orgID
}

async function recreateBucket(orgId: string, name: string) {
    try {
        const buckets = await bucketsAPI.getBuckets({orgID: orgId, name})
        if (buckets && buckets.buckets && buckets.buckets.length) {
            console.log(`Bucket named "${name}" already exists"`)
            const bucketID = buckets.buckets[0].id as string
            console.log(`*** Delete Bucket "${name}" identified by "${buckets.buckets[0].id}" ***`)
            await bucketsAPI.deleteBucketsID({bucketID})
        }
    } catch (e) {
        if (e instanceof HttpError && e.statusCode == 404) {
            // OK, bucket doesn't exist (first run)
        } else {
            throw e
        }
    }

    console.log(`*** Create Bucket "${name} in org: ${influxOrgID}" ***`)
    const bucket = await bucketsAPI.postBuckets({body: {orgID: orgId, name}})
    console.log(`*** Bucket "${bucket.name}" created ***`)
}

async function writePointsForUTCDate(influxDB: InfluxDB, orgId: string, bucket:string, start: Date) {
    // Separate WriteApi for each day is on purpose - we have a lot of data to write
    // 's' parameter is seconds - the WriteApi granularity
    const writeAPI = influxDB.getWriteApi(orgId, bucket, 's')
    writeAPI.useDefaultTags({ticker: 'LLNK'})

    const end = new Date(start.getTime())
    end.setDate(end.getDate()+1)

    try {
        let buffer = 0
        while (start.getTime() < end.getTime()) {
            //50% chance the baseline stays the same for the next one second
            if (Math.random() < 0.5) {
                baseline = baseline + (direction * amplitude)
            }

            const point = new Point('price')
                .floatField('value', (Math.round(baseline * 100) / 100))
                .timestamp(start) 
            writeAPI.writePoint(point)
            buffer++
            start.setUTCSeconds(start.getUTCSeconds()+1)

            // Direction change is recalculated every 10 seconds:
            // It has a 90% of occuring if the baseline is outside the soft cap limits
            // And in this case is always in order to bring back the baseline within the soft caps
            // And it has a 40% chance of occuring randomly otherwise
            if (buffer % 10 == 0) {
                if ((baseline < soft_min) && (Math.random() < 0.9)) {
                    direction = Math.abs(direction)
                } else if ((baseline > soft_max) && (Math.random() < 0.9)) {
                    direction = -Math.abs(direction)
                } else if (Math.random() < 0.4) {
                    direction = -direction
                }
                // Amplitude always changes every 10 seconds regardless of direction change
                amplitude = getAmplitude()
            }

            // 5000 is the recommended batch size by InfluxDB
            if (buffer == 5000) {
                buffer = 0
                await writeAPI.flush()
            }
        }
  
        await writeAPI.close()
    } catch (e) {
    //FXIME: Handle error better?
        console.error(e)
    }  
}

function randomNumber(min: number, max:number) {
    return Math.random() * (max - min) + min
}
