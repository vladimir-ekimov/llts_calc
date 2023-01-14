import { InfluxDB } from '@influxdata/influxdb-client'
import { TimePeriod, TurningPoint, MeasuredPoint } from '../CalculatorTypes'

// FIXME: Hardcoded - trying to get env vars passed through typescript while being watched by nodemon
const INFLUXDB_URL = process.env.INFLUXDB_URL
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN
const INFLUXDB_ORG = process.env.INFLUXDB_ORG
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET

export class InfluxDataManager {
    // Flux query that returns all turning points in the supplied period
    static async getTurningPoints(period: TimePeriod) : Promise<TurningPoint[]> {
        const startDate = period.start.timestamp
        //NOTE: InfluxDB query results exclude rows that exactly match the query stop time
        const endDate = new Date(period.end.timestamp)
        endDate.setMilliseconds(endDate.getMilliseconds()+1)

        if (!INFLUXDB_URL || ! INFLUXDB_ORG) {
            throw 'Missing INFLUXDB CONFIG ENV VARS' //FIXME
        }

        const fluxQuery = `from(bucket: "${INFLUXDB_BUCKET}")
         |> range(start: time(v: "${startDate.toISOString()}"), stop: time(v: "${endDate.toISOString()}"))
         |> yield ()
        `

        console.log(fluxQuery)

        const queryApi = new InfluxDB({url: INFLUXDB_URL, token:INFLUXDB_TOKEN}).getQueryApi(INFLUXDB_ORG)
        console.log('*** QUERY ROWS ***')

        let min_value = null
        let max_value = null

        let first, last, prev: MeasuredPoint | undefined
        let direction = 0 //Trend direction
        const turningPoints = new Array<TurningPoint>()

        const t1 = new Date()
        try {
            for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
                const o = tableMeta.toObject(values)
                min_value = (!min_value || (min_value > o._value)) ? o._value : min_value
                max_value = (!max_value || (max_value < o._value)) ? o._value : max_value

                if (!prev) {
                    prev = {timestamp: o._time, value: o._value}
                    continue
                }
                const curr: MeasuredPoint = {timestamp: o._time, value: o._value}
                // console.log(`${JSON.stringify(prev)} ===>>> ${JSON.stringify(curr)}`)

                if (curr.value > prev.value) { //Current going up
                    if (direction < 0) { //Turning point - local minimum
                        turningPoints.push(new TurningPoint(prev, true))
                        // console.log(`     ${JSON.stringify(prev)} is locyal min`)
                    } else { //Current up trend continues
                    }
                    direction = 1
                } else if (curr.value < prev.value) { //Current going down
                    if (direction > 0) { //Turning point - local maximum
                        turningPoints.push(new TurningPoint(prev, false))
                        // console.log(`     ${JSON.stringify(prev)} is local max`)
                    } else { // Current down trend continues
                    }
                    direction = -1
                } else { //Current remains the same

                }
                if (!first && direction != 0) {
                    first = new TurningPoint(prev, direction == 1)
                    console.log(`first: ${JSON.stringify(first)}`)
                    turningPoints.push(first)
                }

                last = curr
                prev = curr
            }

            if (last) {
                last = new TurningPoint(last, direction == -1)
                console.log(`last: ${JSON.stringify(last)}`)
                turningPoints.push(last)
            }


        } catch (e) {
            //FIXME: Handle exceptions
            console.log(e)
            return new Array<TurningPoint>()
        }
        const t2 = new Date()
        console.log(`*** It took ${((t2.getTime() - t1.getTime()) / 1000)} seconds to ITERATE`)
        console.log(`MIN ${min_value} MAX ${max_value}`)

        return turningPoints
    }
}