import React, { useEffect, useState, useRef } from 'react'
import Mapbox from '../Mapbox/Mapbox'
import DataLayer from '../DataLayer/DataLayer'
import Nav from '../Nav/Nav'
import SelectBar from '../SelectBar/SelectBar'
import axios from 'axios'
import './App.css';

export default function App() {
	const [bounds, setBounds] = useState(null)
	const [data, setData] = useState(null)
	const [param, setParam] = useState('t')
	const [time, setTime] = useState(1672434000)
	const [viewport, setViewport] = useState({
		longitude: -96,
		latitude: 37.8,
		zoom: 5
	})

	const getData = async () => {
		const url = `https://skyscan-backend.herokuapp.com/weather/${param}/${time}/${JSON.stringify(bounds)}`
		const res = await axios.get(url)
		if (res.data.length > 300) {
			const smallerData = []
			const scaleFactor = Math.round(res.data.length / 300)
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
			<DataLayer data={data} param={param} />
			<div id='menu'>
				<Nav viewport={viewport} setViewport={setViewport} />
				<SelectBar time={time} setTime={setTime} setParam={setParam} />
			</div>
		</div>
	)
}
