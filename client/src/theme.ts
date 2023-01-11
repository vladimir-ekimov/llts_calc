import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#123456',
            light: '#567890'
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                root : {
                    background: 'white',
                   
                },
                input: {
                    background: 'white',
                    borderRadius: '4px',
                }
            }
        }
    }
})

export default theme