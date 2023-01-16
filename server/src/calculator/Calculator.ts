import { MeasuredTimePeriod, TurningPoint } from 'llnkts-common'
import { InfluxDataManager } from './influx/InfluxDataManager'

export class Calculator {
    static async getBestBuyPeriodNew(startDate: Date, endDate: Date) : Promise<MeasuredTimePeriod> {
        let t1 = new Date()
        const turningPoints = await InfluxDataManager.getTurningPoints({start: {timestamp: startDate}, end: {timestamp: endDate}})
        let t2 = new Date()

        //Make sure we always start with min and end with max
        if (!turningPoints[0].isMin) {
            turningPoints.shift()
        }
        if (turningPoints[turningPoints.length-1].isMin) {
            turningPoints.pop()
        }

        let t = (t2.getTime()-t1.getTime()) / 1000

        console.log(`*** TURNING POINTS: ${turningPoints.length}. It took ${t} seconds to fetch them`)
        // for (let p of turningPoints) {
        //   console.log(JSON.stringify(p))
        // }

        console.log('******************************')
        let bestPeriod = new MeasuredTimePeriod({timestamp: new Date(), value:0}, {timestamp: new Date(), value:0})
        t1 = new Date()
        for (let i=0; i < turningPoints.length; i=i+2) {
            for (let j=i+1; j < turningPoints.length; j=j+2) {
                if (turningPoints[i].value < turningPoints[j].value) {
                    if (Math.abs(turningPoints[i].value - turningPoints[j].value) > bestPeriod.getDelta()) {
                        bestPeriod = new MeasuredTimePeriod(turningPoints[i], turningPoints[j])
                    }
                }
            }
        }
        t2 = new Date()

        //turningPoints = this.smoothIncreasingSlopes(turningPoints);
        t = (t2.getTime()-t1.getTime()) / 1000
        console.log(`*** BEST PERIOD: ${JSON.stringify(bestPeriod)}. It took ${t} seconds to determine it.`)

        return bestPeriod
    }

    static smoothIncreasingSlopes(p: Array<TurningPoint>): Array<TurningPoint> {
        let i=0
        console.log('***///smoothIncreasingSlopes///***')
        while (i+3 < p.length) {
            process.stdout.write(`11..${i}, `)

            for (let j=i+3; j < p.length; j++) {
                if (p[i].value < p[i+1].value && p[i].value < p[i+2].value) {
                    process.stdout.write(`22..${i}, `)
                    if (p[i+3].value > p[i+1].value && p[i+3].value > p[i+2].value) {
                        process.stdout.write(`33..${i}, `)
                        if (Math.abs(p[i+3].value - p[i].value) < (
                            Math.abs(p[i+3].value - p[i+1].value) +
                            Math.abs(p[i].value - p[i+2].value)
                        )) {
                            process.stdout.write(`44..${i}, `)
                            p.splice(i+1,i+2)
                            i--
                        }
                    }
                }
            }

            if (p[i].value < p[i+1].value && p[i].value < p[i+2].value) {
                process.stdout.write(`22..${i}, `)
                if (p[i+3].value > p[i+1].value && p[i+3].value > p[i+2].value) {
                    process.stdout.write(`33..${i}, `)
                    if (Math.abs(p[i+3].value - p[i].value) < (
                        Math.abs(p[i+3].value - p[i+1].value) +
                        Math.abs(p[i].value - p[i+2].value)
                    )) {
                        process.stdout.write(`44..${i}, `)
                        p.splice(i+1,i+2)
                        i--
                    }
                }
            }
            i++
            console.log('')
        }
        console.log('***///smoothIncreasingSlopes///***')
        return p
    }
}