import React from 'react'
import './SelectBar.css'

export default function SelectBar({ time, setTime, setParam }) {

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

    const convertDate = (time) => {
        const date = new Date(time * 1000)
        return (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear())
    }

    return (
        <div id='select-bar'>
            <select id='param-select' onChange={(e) => { handleParamChange(e) }}>
                {Object.keys(params).map(p => <option key={p}>{p}</option>)}
            </select>
            {time && <div id='time-select'>
                <button onClick={() => { handleTimeChange(-3) }}>{`(-) 3hr`}</button>
                {time && `${convertTime(time)} - ${convertDate(time)}`}
                {time < 1672434000 && <button onClick={() => { handleTimeChange(3) }}>{`(+) 3hr`}</button>}
            </div>}
        </div>
    )
}
