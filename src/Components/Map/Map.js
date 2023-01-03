import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

export default function Map() {
    const mapContainer = useRef(null)

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-96, 37.8],
            zoom: 3
        })
        return () => map.remove()
    }, [])

    return (
        <div ref={mapContainer} id='map' />
    )
}
