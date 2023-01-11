import React from 'react'
import { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

interface datePickerProps {
    minDateTime: Dayjs | null,
    value : Dayjs | null,
    setValue(x: Dayjs | null): void
}


const DatePicker = (props: datePickerProps) => {
    
    return (
        <DateTimePicker
            minDateTime={props.minDateTime}
            renderInput={(props) => <TextField {...props} size="small" />}
            value={props.value}
            inputFormat="YYYY-MM-DD HH:mm:ss"
            onChange={(newValue) => { props.setValue(newValue) }}
        />
    )
}

export default DatePicker