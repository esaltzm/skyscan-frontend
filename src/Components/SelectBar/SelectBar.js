import React from 'react'
import './SelectBar.css'

export default function SelectBar({ time }) {

    const params = {
        'temperature': 't',
        'precipitation rate': 'prate',
        'wind gust speed': 'gust',
        'snow depth': 'sde',
        'lightning': 'ltng'
    }

    const convertTime = (time) => {
        const date = new Date(time * 1000)
        const hours = date.getHours()
        const ampm = hours >= 12 ? 'pm' : 'am'
        const hour = hours >= 12 ? hours % 12 : hour
        return `${hour} ${ampm}`
    }

    return (
        <div id='select-bar'>
            <select id='param-select'>
                {Object.keys(params).map(p => <option>{p}</option>)}
            </select>
            {time && <div id='time-select'>
                <button>{`(-) 3hr`}</button>
                {convertTime(time)}
                {time < 1672434000 && <button>{`(+) 3hr`}</button>}
            </div>}
        </div>
    )
}
