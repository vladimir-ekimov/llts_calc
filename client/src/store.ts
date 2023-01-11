import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'

//////////////////////////////////////////////////////////////////////
// ********* COPY / PASTE from server
//
// It would be really cool to figure out how to export these from the
// back-end and import them in the front-end.
//////////////////////////////////////////////////////////////////////
// Just a point in time - not necessarily with measured value
interface Point {
    timestamp: Date;
    value?: number;
}
// A point in time with a measured value guaranteed to be present
interface MeasuredPoint extends Point {
    timestamp: Date;
    value: number;
}
// Just a time period representation using two points for start and end
export interface TimePeriod {
    start: Point;
    end: Point;
}
// A time period with measured start and stop allowing for amplitude calculation
export class MeasuredTimePeriod implements TimePeriod {
    start: MeasuredPoint
    end: MeasuredPoint

    constructor(start: MeasuredPoint, end: MeasuredPoint) {
        this.start = start
        this.end = end
    }

    getAmplitude(): number {
        if (this.start.value && this.end.value) {
            return this.end.value - this.start.value
        }
        return 0        
    }
}
// ********* 
//////////////////////////////////////////////////////////////////////

export interface IRootState {
    data: MeasuredTimePeriod,
    amount: number | null,
    loading: boolean,
    error: string[]    
}

interface Params {
    startDate: string,
    endDate: string,
    amount: number
}

interface Result {
    data: MeasuredTimePeriod,
    amount: number | null
}

export const getResult = createAsyncThunk<Result, Params>(
    'getResult',
    async (params, { rejectWithValue }) => {
        const { startDate, endDate, amount } = params

        try {
            //FIXME: HARDCODED
            //FIXME: not rest
            const response = await axios.post<MeasuredPoint, any>('http://localhost:8080/calc', {
                startDate, endDate
            })
            return { data: response.data, amount }
        } catch (e) {
            const err = e as AxiosError
            let result: string[] =  ['generic!']
            if (err.response && err.response.data) {
                result = err.response.data
            }
            else {
                result = [err.message]
            }
            return rejectWithValue(result as string[])
        }
    }
)

const initialState: IRootState= {
    data: {},
    amount: null,
    loading: false,
    error: []
}

const paramsSlice = createSlice({
    name: 'params',
    initialState,
    reducers: {
        setError: {
            reducer: (state, action: PayloadAction<string>) => {(state.error = [action.payload])},
            prepare: (error: string) => ({ payload: error }),
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getResult.pending, (state) => { state.loading = true })
            .addCase(getResult.rejected, (state, action) => { state.data = {}; state.error = action.payload; state.loading = false})
            .addCase(getResult.fulfilled, (state, action) => {
                state.error = []
                state.data = action.payload.data
                state.amount = action.payload.amount
                state.loading = false
            })
    }
})

export const { setError } = paramsSlice.actions
export default paramsSlice.reducer


