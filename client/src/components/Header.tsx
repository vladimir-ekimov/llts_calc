import React from 'react'
import Box from '@mui/material/Box'
import Params from './Params'
import Grid from '@mui/material/Grid'
import logo from '../../assets/logo.png'

const Header = () => {
    return (
        <Box sx={{ bgcolor: 'primary.light', padding: '10px' }}>
            <Grid container rowSpacing={2} columns={{ xs: 1, sm: 12, md: 12 }} >
                <Grid item xs={1} sm={2} md={2}>
                    <Box 
                        sx={{textAlign: {xs: 'center', sm: 'left', md: 'left'}}}> 
                        <img  src={logo} alt="logo"/>
                    </Box>
                </Grid>
                <Grid item xs={1} sm={10} md={10}>
                    <Params />
                </Grid>
            </Grid>
        </Box>

    )
}

export default Header