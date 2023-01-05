import React, { forceUpdate } from 'react'

export default function Nav({ zoomLevel, setZoomLevel }) {
    const zoom = (n) => {
        const newZoomLevel = { ...zoomLevel }
        newZoomLevel.zoom += n
        setZoomLevel(newZoomLevel)
    }
    return (
        <div className="Nav" style={{ display: 'flex', zIndex: "100", position: "absolute", }}>
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
