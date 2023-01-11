import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const Loader = () => {
    return (
        <Box sx={{position: 'absolute', top: '50%',left: '50%'}}>
            <CircularProgress color="primary" />
        </Box>
    )
}

export default Loader