import React, { useState } from 'react'
import Mapbox from '../Mapbox/Mapbox'
import DataLayer from '../DataLayer/DataLayer'
import DataMap from '../DataMap/DataMap'
import './App.css';

export default function App() {
	const [bounds, setBounds] = useState(null)
	return (
		<div className='App'>
			{/* <Mapbox setBounds={setBounds}></Mapbox>
			<DataLayer /> */}
			<DataMap />
		</div>
	)
}
