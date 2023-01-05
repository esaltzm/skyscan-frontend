import React, { useEffect, useState, useRef } from 'react'
import Mapbox from '../Mapbox/Mapbox'
import DataLayer from '../DataLayer/DataLayer'
import Nav from '../Nav/Nav'
import axios from 'axios'
import './App.css';

//Potential way to use plotly and mapbox - make my own zoom and move buttons, link to map via state

export default function App() {
	const [bounds, setBounds] = useState(null)
	const [data, setData] = useState(null)
	const [param, setParam] = useState('t')
	const [time, setTime] = useState(1641308400)
	const [viewport, setViewport] = useState({
		longitude: -96,
		latitude: 37.8,
		zoom: 4
	})

	const getData = async () => {
		const url = `https://skyscan-backend.herokuapp.com/weather/${param}/${time}/${JSON.stringify(bounds)}`
		console.log(url)
		const res = await axios.get(url)
		if (res.data.length > 2000) {
			const smallerData = []
			const scaleFactor = Math.round(res.data.length / 2000)
			for (let i = 0; i < res.data.length; i += scaleFactor) {
				smallerData.push(res.data[i])
			}
			setData(smallerData)
		} else { setData(res.data) }
	}

	useEffect(() => {
		console.log('bounds: ', bounds)
		bounds && getData()
	}, [bounds])
	return (
		<div className='App'>
			<Mapbox setBounds={setBounds} viewport={viewport} />
			<DataLayer data={data} setData={setData} />
			<Nav viewport={viewport} setViewport={setViewport} />
		</div>
	)
}
