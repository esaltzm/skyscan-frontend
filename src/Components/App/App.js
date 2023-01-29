import React, { useEffect, useState } from 'react'
import Mapbox from '../Mapbox/Mapbox'
import DataLayer from '../DataLayer/DataLayer'
import Nav from '../Nav/Nav'
import SelectBar from '../SelectBar/SelectBar'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css';

//TODO: 
// set limit on zoom and drag to those bounds
// incorporate altitude data to temperature map
// look into mapbox layers instead of plotly data layer
// find middle ground between range(all data) and range(current view slice)

export default function App() {

	const [bounds, setBounds] = useState(null)
	const [data, setData] = useState(null)
	const [param, setParam] = useState('t')
	const [time, setTime] = useState(null)
	const [timeBounds, setTimeBounds] = useState(null)
	const [loading, setLoading] = useState(true)
	const [paramRange, setParamRange] = useState(null)
	const [viewport, setViewport] = useState({
		longitude: -96,
		latitude: 37.8,
		zoom: 4.0
	})

	const getData = async () => {
		setLoading(true)
		const url = `https://skyscan-backend.herokuapp.com/weather/${param}/${time}/${JSON.stringify(bounds)}`
		const res = await axios.get(url)
		if (res.data.length > 250) {
			const smallerData = []
			const scaleFactor = Math.round(res.data.length / 250)
			for (let i = 0; i < res.data.length; i += scaleFactor) {
				smallerData.push(res.data[i])
			}
			setData(smallerData)
		} else { setData(res.data) }
		setLoading(false)
	}

	const getLatestTime = async () => {
		const res = await axios.get('https://skyscan-backend.herokuapp.com/times')
		const time = res.data[0].highest
		setTimeBounds(res.data[0])
		setTime(time)
	}

	const getParamRange = async () => {
		const res = await axios.get(`https://skyscan-backend.herokuapp.com/minmax/${time}/${param}`)
		let range = res.data[0]
		switch (param) {
			case ('t'):
				range = Object.keys(range).forEach(key => range[key] = range[key] * 1.8 + 32)
				break
			case ('prate'):
				range = Object.keys(range).forEach(key => range[key] = range[key] * 1000)
				break
			case ('gust'):
				range = Object.keys(range).forEach(key => range[key] = range[key] * 2.23694)
				break
			case ('sde'):
				range = Object.keys(range).forEach(key => range[key] = range[key] * 3.28084)
				break
			default:
				range = range
		}
		setParamRange(res.data[0])
	}

	useEffect(() => {
		getLatestTime()
	}, [])

	useEffect(() => {
		getParamRange()
	}, [param, time])

	useEffect(() => {
		bounds && getData()
	}, [bounds, param, time])

	return (
		<div className='App'>
			<ToastContainer />
			<Mapbox setBounds={setBounds} viewport={viewport} />
			{loading ?
				<div className='spinner-container'>
					<div className='lds-spinner'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
				</div> :
				data && <DataLayer data={data} param={param} loading={loading} setLoading={setLoading} viewport={viewport} setViewport={setViewport} bounds={bounds} paramRange={paramRange} />}
			<div id='nav'>
				<Nav viewport={viewport} setViewport={setViewport} setLoading={setLoading} />
			</div>
			<div id='menu'>
				{time && <SelectBar time={time} setTime={setTime} setParam={setParam} setLoading={setLoading} timeBounds={timeBounds} />}
			</div>
		</div>
	)
}
