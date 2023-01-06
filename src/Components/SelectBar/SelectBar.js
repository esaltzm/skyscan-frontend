import React, { useState } from 'react'
import './SelectBar.css'

export default function SelectBar({ time, setTime, setParam }) {

    const [date, setDate] = useState('2022-12-30')

    const params = {
        'temperature': 't',
        'precipitation rate': 'prate',
        'wind gust speed': 'gust',
        'snow depth': 'sde',
        'lightning': 'ltng'
    }

    const handleParamChange = (e) => {
        setParam(params[e.target.value])
    }

    const handleTimeChange = (h) => {
        const newTime = time + (h * 3600)
        setTime(newTime)
    }

    const convertTime = (time) => {
        const date = new Date(time * 1000)
        const hours = date.getHours()
        const ampm = hours >= 12 ? 'pm' : 'am'
        const hour = hours >= 12 ? hours % 12 : hours
        return `${hour} ${ampm}`
    }

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value)
        const oldDate = new Date(time * 1000)
        const difference = (newDate - oldDate) / 1000
        console.log(newDate, oldDate, difference, time)
        setDate(newDate.toISOString().split('T')[0])
        setTime(time + difference)
    }

    return (
        <div id='select-bar'>
            <select id='param-select' onChange={(e) => { handleParamChange(e) }}>
                {Object.keys(params).map(p => <option key={p}>{p}</option>)}
            </select>
            {time && <div id='time-select'>
                <button onClick={() => { handleTimeChange(-3) }}>{`(-) 3hr`}</button>
                {time && `${convertTime(time)}`}
                <input type='date' value={date} min='2021-12-30' max='2022-12-30' onChange={(e) => { handleDateChange(e) }} />
                {time < 1672434000 && <button onClick={() => { handleTimeChange(3) }}>{`(+) 3hr`}</button>}
            </div>}
        </div>
    )
}
