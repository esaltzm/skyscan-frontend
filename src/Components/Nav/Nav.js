import React, { forceUpdate } from 'react'
import './Nav.css'

export default function Nav({ viewport, setViewport }) {
    const zoom = (n) => {
        const newViewport = { ...viewport }
        newViewport.zoom += n
        setViewport(newViewport)
    }
    return (
        <div className="Nav" style={{ display: 'flex' }}>
            <button
                onClick={() => { zoom(1) }}>
                +
            </button>
            <button
                onClick={() => { zoom(-1) }}>
                -
            </button>
            <div id='zoom'>(zoom)</div>
        </div>
    )
}
