import React, { useState, useEffect, useCallback, useRef } from 'react'
import Map, { NavigationControl } from 'react-map-gl'
import { viewport, bounds } from '@mapbox/geo-viewport'
import 'mapbox-gl/dist/mapbox-gl.css'
import './Mapbox.css'
import useWindowDimensions from '../WindowDimensions'

export default function Mapbox({ setBounds }) {
    const mapRef = useRef(null)
    let { height, width } = useWindowDimensions()
    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current.getMap()
            const center = map.getCenter()
            const zoom = map.getZoom()
            const size = map.getSize()
            const bounds = bounds(center, zoom, [size.width, size.height])
            console.log(bounds)
            setBounds(bounds)
        }
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
                style={{ width: "100vw", height: "100vh", position: 'absolute', top: '0', left: '0', zIndex: '0' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                ref={mapRef}
            >
                <div style={{ zIndex: '100', position: 'absolute' }}>
                    <NavigationControl position='top-left' />
                </div>
            </Map>
        </div>
    )
}
