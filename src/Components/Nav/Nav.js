import React, { forceUpdate } from 'react'

export default function Nav({ viewport, setViewport }) {
    const zoom = (n) => {
        const newViewport = { ...viewport }
        newViewport.zoom += n
        setViewport(newViewport)
    }
    return (
        <div className="Nav" style={{ display: 'flex', zIndex: "100", position: "absolute" }}>
            <button
                onClick={() => { zoom(1) }}>
                +
            </button>
            <button
                onClick={() => { zoom(-1) }}>
                -
            </button>
        </div>
    )
}
