import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import App from './App'
import {default as rootReducer } from './store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const store = configureStore({ reducer: rootReducer })

console.log(`LLNKTS_TEST_VAR: ${process.env.LLNKTS_TEST_VAR}`)

// TODO read more 
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch: () => AppDispatch = useDispatch;

root.render(
    <Provider store = {store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
)