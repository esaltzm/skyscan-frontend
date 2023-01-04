import React, { useState, useEffect, useCallback } from 'react'
import Map, { NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './Mapbox.css'

export default function Mapbox() {
    const [bounds, setBounds] = useState(null)
    useEffect(() => {
        console.log(`Bounding coordinates changed to ${bounds}`)
    }, [bounds])

    const onMove = useCallback(({ viewState }) => {
        const newCenter = [viewState.longitude, viewState.latitude];
        console.log(viewState)
    }, [])


    return (
        <div className="map-container">
            <Map
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                initialViewState={{
                    longitude: -96,
                    latitude: 37.8,
                    zoom: 4
                }}
                className='mapbox'
                style={{ width: "100vw", height: "100vh", position: 'absolute', top: '0', left: '0', zIndex: '0' }}
                mapStyle='mapbox://styles/mapbox/satellite-v9' //"mapbox://styles/mapbox/streets-v9" //
                onMove={onMove}
            >
                <NavigationControl style={{ position: 'absolute', top: '10', left: '10', zIndex: '1' }} />
            </Map>
            <h1 style={{ color: 'white', zIndex: '100' }}>TEST</h1>
        </div>
    )
}
