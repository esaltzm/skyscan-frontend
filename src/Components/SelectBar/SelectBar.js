import React, { useState, useEffect } from 'react'
import './SelectBar.css'

export default function SelectBar({ time, setTime, setParam, setLoading, timeBounds }) {

    const [date, setDate] = useState(null)

    useEffect(() => {
        const newDate = new Date(time)
        setDate(formatDate(newDate))
    }, [time])

    const params = {
        'temperature': 't',
        'precipitation rate': 'prate',
        'wind gust speed': 'gust',
        'snow depth': 'sde',
        'lightning': 'ltng'
    }

    const formatDate = (t) => {
        const d = new Date(t * 1000)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2)
            month = '0' + month
        if (day.length < 2)
            day = '0' + day
        return [year, month, day].join('-')
    }

    const handleParamChange = (e) => {
        setLoading(true)
        setParam(params[e.target.value])
    }

    const handleTimeChange = (h) => {
        setLoading(true)
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
        setLoading(true)
        const newDate = new Date(e.target.value)
        const oldDate = new Date(time * 1000)
        const difference = (newDate - oldDate) / 1000
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
                {time < timeBounds.highest && <button onClick={() => { handleTimeChange(3) }}>{`(+) 3hr`}</button>}
                {timeBounds && <input type='date' value={date} min={formatDate(timeBounds.lowest)} max={formatDate(timeBounds.highest)} onChange={(e) => { handleDateChange(e) }} />}
            </div>}
        </div>
    )
}
