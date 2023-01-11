import React from 'react'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import Loader from './Loader'
import Item from './Item'
import Note from './Note'

import { IRootState } from '../store'
import EventIcon from '@mui/icons-material/Event'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import MoneyIcon from '@mui/icons-material/Money'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

const Content = () => {
    const loading = useSelector((state: IRootState) => state.loading)
    const data = useSelector((state: IRootState) => state.data)
    const amount = useSelector((state: IRootState) => state.amount)
    const error = useSelector((state: IRootState) => state.error)

    const getFotmattedDate = (value: Date) => {
        return dayjs.utc(value).format('YYYY-MM-DD HH:mm:ss')
    }

    if (loading) return <Loader />
    if (error.length) return <Note/>
    if (!Object.keys(data).length) return null
    
    return (
        <Box sx={{
            borderRadius: '4px',
            padding: { xs: '0', sm: '20px', md: '30px' },
            boxShadow: 2,
            width: { xs: '90%', sm: '60%', md: '60%' },
            margin: '60px auto'
        }}>

            <Item icon={<EventIcon />} label="Best buy time" value={getFotmattedDate(data.start.timestamp)} />
            <Item icon={<AttachMoneyIcon />} label="Buy price" value={data.start.value.toString()} />
            <Item icon={<TrendingUpIcon />} label="Stocks" value={Math.floor(amount / data.start.value).toString()} />
            <Item icon={<EventIcon />} label="Best sell time" value={getFotmattedDate(data.end.timestamp)} />
            <Item icon={<AttachMoneyIcon />} label="Sell price" value={data.end.value.toString()} />
            <Item icon={<MoneyIcon />} label="Profit"
                value={
                    (
                        Math.floor(amount / data.start.value) *
                        (data.end.value - data.start.value)
                    ).toFixed(2).toString()} />
        </Box>
    )
}

export default Content