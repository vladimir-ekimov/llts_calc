import React from 'react'
import Header from './components/Header'
import Content from './components/Content'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Content />
        </ThemeProvider>
    )
}

export default App