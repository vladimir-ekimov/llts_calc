import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useDispatch } from 'react-redux'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TextField, Button, Grid } from '@mui/material'

import DatePicker from './DatePicker'
import { getResult, setError } from '../store'

dayjs.extend(utc)

const Params = () => {
    const dispatch = useDispatch()
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs.utc('2022-10-16T00:00:00Z'))
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs.utc('2022-10-17T00:00:00Z'))
    const [amount, setAmount] = useState<string>('737')

    useEffect(() => {
        if (startDate && endDate && startDate > endDate) {
            setEndDate(startDate)
        }
    }, [startDate])

    const onStartDateChange = (value: Dayjs | null) => {
        setStartDate(value)
    }

    const onEndDateChange = (value: Dayjs | null) => {
        setEndDate(value)
    }

    const onSubmit = () => {
        if (!amount) { dispatch(setError('Amount can\'t be empty!')); return }
        if (!amount.match(/^\d*$/)) { dispatch(setError('Amount should be a number!')); return }
        dispatch(getResult({
            startDate: (startDate ? startDate.toISOString() : ''),
            endDate: (endDate ? endDate.toISOString() : ''),
            amount: Number(amount)
        }))
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={2} sm={3} md={3} >
                    <DatePicker minDateTime={null} value={startDate} setValue={onStartDateChange} />
                </Grid>
                <Grid item xs={2} sm={3} md={3}>
                    <DatePicker minDateTime={startDate} value={endDate} setValue={onEndDateChange} />
                </Grid>
                <Grid item xs={2} sm={3} md={3}>
                    <TextField size="small" value={amount} onChange={(e) => setAmount(e.target.value)} variant="outlined" />
                </Grid>
                <Grid item xs={2} sm={3} md={3} style={{ textAlign: 'center' }}>
                    <Button sx={{width : {xs: '100%', sm: '60%', md: '60%'}}} onClick={onSubmit} color="primary" variant="contained">Submit</Button>
                </Grid>
            </Grid>
        </LocalizationProvider>
    )
}

export default Params