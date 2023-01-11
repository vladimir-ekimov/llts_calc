import React from 'react'
import { Box, Grid, Divider } from '@mui/material'

interface itemProps {
    icon: object,
    label: string,
    value: string
}

const Item = (props: itemProps) => {

    return (
        <>
            <Grid sx={{ padding: '20px' }} container columns={{ xs: 2, sm: 2, md: 2 }} >
                <Grid item sx={{ fontWeight: 'bold' }} xs={1} sm={1} md={1}>
                    <Box sx={{ display: 'flex' }}>
                        <>
                            {props.icon}
                            <span style={{ paddingLeft: '10px' }}>{props.label}</span>
                        </>
                    </Box>
                </Grid>
                <Grid item xs={1} sm={1} md={1}>
                    {props.value}
                </Grid>

            </Grid>
            <Divider />
        </>
    )
}

export default Item