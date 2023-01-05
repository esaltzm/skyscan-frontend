import React, { useEffect, useState, useRef } from 'react'
import Mapbox from '../Mapbox/Mapbox'
import DataLayer from '../DataLayer/DataLayer'
import Nav from '../Nav/Nav'
import DataMap from '../DataMap/DataMap'
import './App.css';

//Potential way to use plotly and mapbox - make my own zoom and move buttons, link to map via state

export default function App() {
	const [bounds, setBounds] = useState(null)
	const [viewport, setViewport] = useState({
		longitude: -96,
		latitude: 37.8,
		zoom: 4
	})

	return (
		<div className='App'>
			<Mapbox setBounds={setBounds} viewport={viewport} />
			<DataLayer />
			<Nav viewport={viewport} setViewport={setViewport} />
		</div>
	)
}
