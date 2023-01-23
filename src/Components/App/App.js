import React, { useEffect, useState } from 'react'
import Mapbox from '../Mapbox/Mapbox'
import InitialData from '../DataLayer/InitialData.json'
import DataLayer from '../DataLayer/DataLayer'
import Nav from '../Nav/Nav'
import SelectBar from '../SelectBar/SelectBar'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css';

//TODO: 
// set limit on zoom and drag to those bounds

export default function App() {
	const [initialDataFetch, setInitialDataFetch] = useState(true)
	const [bounds, setBounds] = useState(null)
	const [data, setData] = useState(null)
	const [param, setParam] = useState('t')
	const [time, setTime] = useState(1672434000)
	const [loading, setLoading] = useState(true)
	const [viewport, setViewport] = useState({
		longitude: -96,
		latitude: 37.8,
		zoom: 4.0
	})
	const getData = async () => {
		setLoading(true)
		let res = {}
		if (initialDataFetch === false) {
			const url = `https://skyscan-backend.herokuapp.com/weather/${param}/${time}/${JSON.stringify(bounds)}`
			res = await axios.get(url)
		} else {
			res.data = InitialData['data']
			setInitialDataFetch(false)
		}
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
				<DataLayer data={data} param={param} loading={loading} setLoading={setLoading} viewport={viewport} setViewport={setViewport} bounds={bounds} />}
			<div id='nav'>
				<Nav viewport={viewport} setViewport={setViewport} setLoading={setLoading} />
			</div>
			<div id='menu'>
				<SelectBar time={time} setTime={setTime} setParam={setParam} setLoading={setLoading} />
			</div>
		</div>
	)
}
