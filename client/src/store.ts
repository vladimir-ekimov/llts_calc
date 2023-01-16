import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { MeasuredPoint, MeasuredTimePeriod } from '../../common/src'

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
            const response = await axios.post<MeasuredPoint, any> (`${process.env.LLNKTS_SERVER_URL}/calc`, {
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


