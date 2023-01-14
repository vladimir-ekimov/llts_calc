import express, { Request, Response } from 'express'
import cors from 'cors'
import { Calculator } from './calculator/Calculator'
import bodyParser from 'body-parser'

const port = 8080 //FIXME: Make configurable
const app = express()
app.use(bodyParser.json())

console.log(`LLNKTS_TEST_VAR: ${process.env.LLNKTS_TEST_VAR}`)

const corsOptions = {
    origin: process.env.LLNKTS_CLIENT_URL
}
app.use(cors(corsOptions))

app.get('/', (req: Request, res: Response) => {
    res.send('Express 111 TypeScript Server')
})

app.post('/calc', async (req: Request, res: Response) => {
    const startDate: Date = new Date(req.body.startDate)
    const endDate: Date = new Date(req.body.endDate)

    console.log('REQ: ', req.body)
    try {
        const bestBuyPeriod = await Calculator.getBestBuyPeriodNew(startDate, endDate)

        if (!bestBuyPeriod) {
            console.log('--- NO DATA')
            res.status(400)
            res.send(['No data in period, or it\'s flat or strictly declining', 'And another msg <3'])
        } else {
            console.log(`RES: [[${JSON.stringify(bestBuyPeriod)}]]`)
            res.send(bestBuyPeriod)
        }
    } catch (e) {
        const ex = e as Error
        console.log(`EXCEPTION: ${ex.name} occurred`)
        console.log(ex.message)
        res.status(400)
        res.send([`Exception (${ex.name}) occurred: ${ex.message} `])
    }
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost: ${port}`)
})
