import express, { Request, Response } from 'express'
import cors from 'cors'
import { Calculator } from './calculator/Calculator'
import bodyParser from 'body-parser'

const port = process.env.PORT || 8080
const app = express()
app.use(bodyParser.json())
// TODO cors
app.use(cors())
//app.use(bodyParser.urlencoded({ extended: true })); //TODO: What is extended?
//app.use(bodyParser.raw());

//FXIME: Remove
app.get('/', (req: Request, res: Response) => {
    res.send('Express 111 TypeScript Server')
})

app.post('/calc', async (req: Request, res: Response) => {
    const startDate: Date = new Date(req.body.startDate)
    const endDate: Date = new Date(req.body.endDate)

    console.log('REQ: ', req.body)
    const bestBuyPeriod = await Calculator.getBestBuyPeriodNew(startDate, endDate)
    if (!bestBuyPeriod) {
        console.log('--- NO DATA')
        res.status(400)
        res.send(['No data in period, or it\'s flat or strictly declining', 'And another msg <3'])
    } else {
        console.log(`RES: [[${JSON.stringify(bestBuyPeriod)}]]`)
        res.send(bestBuyPeriod)
    }
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost: ${port}`)
})
