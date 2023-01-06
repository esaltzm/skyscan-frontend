import React, { useEffect, useRef } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './Mapbox.css'

export default function Mapbox({ setBounds, viewport }) {
    const mapRef = useRef(null)
    const alterBounds = () => {
        const [sw, ne] = Object.values(mapRef.current.getBounds())
        const [swLng, swLat] = Object.values(sw)
        const [neLng, neLat] = Object.values(ne)
        setBounds([[swLat, swLng], [neLat, neLng]])
    }
    
    useEffect(() => {
        mapRef.current && alterBounds()
    }, [viewport])

    return (
        <div className="map-container">
            <Map
                ref={mapRef}
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                {...viewport}
                style={{ width: "100vw", height: "100vh", position: 'absolute', top: '0', left: '0', zIndex: '0' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onLoad={alterBounds}
            />
        </div>
    )
}
