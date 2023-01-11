import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
//import { useDispatch } from "react-redux/es/exports";


import App from './App'
import {default as rootReducer } from './store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const store = configureStore({ reducer: rootReducer })


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