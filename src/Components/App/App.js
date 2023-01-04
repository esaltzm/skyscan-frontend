import React from 'react'
import Mapbox from '../Mapbox/Mapbox'
import DataLayer from '../DataLayer/DataLayer'
import './App.css';

export default function App() {

	return (
		<div className='App'>
			<Mapbox />
			<DataLayer />
		</div>
	)
}
