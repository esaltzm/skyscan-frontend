import React, { useEffect, useState } from 'react'
import Mapbox from '../Mapbox/Mapbox'
import DataLayer from '../DataLayer/DataLayer'
import Nav from '../Nav/Nav'
import SelectBar from '../SelectBar/SelectBar'
import axios from 'axios'
import './App.css';

//TODO: 
// update database to have ocean + lake data (within default bounds)
// set limit on zoom and drag to those bounds
// loading spinner for plot refresh

export default function App() {
	const [bounds, setBounds] = useState(null)
	const [data, setData] = useState(null)
	const [param, setParam] = useState('t')
	const [time, setTime] = useState(1672434000)
	const [loading, setLoading] = useState(false)
	const [viewport, setViewport] = useState({
		longitude: -96,
		latitude: 37.8,
		zoom: 4
	})

	const getData = async () => {
		setLoading(true)
		const url = `https://skyscan-backend.herokuapp.com/weather/${param}/${time}/${JSON.stringify(bounds)}`
		const res = await axios.get(url)
		if (res.data.length > 150) {
			const smallerData = []
			const scaleFactor = Math.round(res.data.length / 150)
			for (let i = 0; i < res.data.length; i += scaleFactor) {
				smallerData.push(res.data[i])
			}
			setData(smallerData)
		} else { setData(res.data) }
	}

	useEffect(() => {
		bounds && getData()
	}, [bounds, param, time])

	return (
		<div className='App'>
			<Mapbox setBounds={setBounds} viewport={viewport} />
			<DataLayer data={data} param={param} loading={loading} setLoading={setLoading} viewport={viewport} setViewport={setViewport} bounds={bounds} />
			<div id='menu'>
				<Nav viewport={viewport} setViewport={setViewport} />
				<SelectBar time={time} setTime={setTime} setParam={setParam} />
			</div>
		</div>
	)
}
