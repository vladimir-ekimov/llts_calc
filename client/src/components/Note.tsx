import React from 'react'
import { useSelector } from 'react-redux'
import {Alert, Stack, Box} from '@mui/material'
import { IRootState } from '../store'

const Note = () => {
    const error = useSelector((state : IRootState) => state.error)

    if (!error.length) return null
    return (
        <Box sx={{height : '60px'}}>
            <Stack>
                <Alert severity="error">{error}</Alert>
            </Stack>
        </Box>
    )
}

export default Note