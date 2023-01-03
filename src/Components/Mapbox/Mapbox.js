import React from 'react'
import Map from 'react-map-gl'
import './Mapbox.css'

export default function Mapbox() {

    return (
        <div className="map-container">
            <Map
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                initialViewState={{
                    longitude: -96,
                    latitude: 37.8,
                    zoom: 3
                }}
                className='mapbox'
                style={{ width: "100vw", height: "100vh", position: 'absolute', top: '0', left: '0', zIndex: '0' }}
                mapStyle='mapbox://styles/mapbox/satellite-v9' //"mapbox://styles/mapbox/streets-v9" //
            />
        </div>
    )
}
