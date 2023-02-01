import React, { useRef } from 'react'
import Plot from 'react-plotly.js'
import useWindowDimensions from '../WindowDimensions'

export default function DataLayer({ data, param, loading, setLoading, viewport, setViewport, bounds, paramRange }) {
	const { height, width } = useWindowDimensions()
	const timer = useRef()

	const units = {
		't': '°F',
		'gust': 'mph',
		'prate': 'mm/hour',
		'sde': 'ft',
		'ltng': '' // unitless param
	}

	if (data && paramRange) {
		const z = data.map(d => d[2])
		var plotData = [{
			x: data.map(d => d[1]),
			y: data.map(d => d[0]),
			z: z,
			type: 'contour',
			showscale: false,
			contours: {
				coloring: 'heatmap',
			},
			line: { width: 0 },
			marker: { opacity: 0.5 },
			hovertemplate: `<i>%{z:.2f} ${units[param]}</i><extra></extra>`,
		}]
	}

	if (plotData) {
		switch (param) {
			case ('t'):
				plotData[0].z = plotData[0].z.map(t => t * 1.8 + 32) // C to F
				plotData[0].zauto = false
				plotData[0].zmin = -10
				plotData[0].zmax = 110
				plotData[0].colorscale = [[0, 'rgb(255, 180, 255)'], [0.1, 'rgb(255,0,255)'], [0.2, 'rgb(180,0,255)'], [0.27, 'rgb(100,0,255)'], [0.35, 'rgb(0,0,255)'], [0.42, 'rgb(0,255,255)'], [0.5, 'rgb(255,255,255)'], [0.6, 'rgb(255,255,0)'], [0.7, 'rgb(255,180,0)'], [0.8, 'rgb(255,0,0)'], [0.9, 'rgb(255,0,255)'], [1, 'rgb(255,180,255)']]
				break
			case ('prate'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.8, 'rgb(0,100,255'], [1, 'rgb(150,0,255)']]
				plotData[0].z = plotData[0].z.map(d => d * 1000)
				break
			case ('gust'):
				plotData[0].zauto = false
				plotData[0].zmin = 0
				plotData[0].zmax = 70
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.142, 'rgb(255,255,255'], [0.28, 'rgb(255,255,130)'], [0.4, 'rgb(255,255,0)'], [0.6, 'rgb(255,0,0)'], [0.8, 'rgb(150,0,255)'], [1, 'rgb(255,255,255)']]
				plotData[0].z = plotData[0].z.map(g => g * 2.23694) // m/s to mph
				break
			case ('sde'):
				plotData[0].colorscale = [[0, 'rgb(0,0,0)'], [0.1, 'rgb(63,161,196)'], [0.5, 'rgb(0,0,255)'], [0.75, 'rgb(130, 0, 255)'], [1, 'rgb(255,0,255)']]
				plotData[0].z = plotData[0].z.map(d => d * 3.28084) // m to ft
				break
			case ('ltng'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255)'], [0.5, 'rgb(255,255,255)'], [0.8, 'rgb(0,255,255'], [0.9, 'rgb(125,255,0)'], [1, 'rgb(255,255,0)']]
				plotData[0].hovertemplate = `<i>%{z:.0f}</i><extra></extra>`
				break
			default: plotData[0].colorscale = [[0, 'rgb(255,255,255)'], [1, 'rgb(0,0,0)']]
		}
	}

	const layout = {
		margin: {
			l: 0,
			r: 0,
			b: 0,
			t: 0,
			pad: 0
		},
		title: false,
		autosize: false,
		dragmode: false,
		width: width,
		height: height
	}

	const config = {
		displayModeBar: false
	}

	const handleDrag = (e) => {
		const isTouchEvent = e.type === 'touchstart'
		const initX = isTouchEvent ? e.touches[0].clientX : e.clientX
		const initY = isTouchEvent ? e.touches[0].clientY : e.clientY

		const latRange = bounds[1][0] - bounds[0][0]
		const lngRange = bounds[1][1] - bounds[0][1]
		const latPixels = height / latRange
		const lngPixels = width / lngRange * -1

		const layer = document.getElementsByClassName('dragcover')[0]
		layer.style.cursor = 'grab'

		const onDragEnd = (e) => {
			const isTouchEvent = e.type === 'touchend'
			const clientX = isTouchEvent ? e.changedTouches[0].clientX : e.clientX
			const clientY = isTouchEvent ? e.changedTouches[0].clientY : e.clientY

			const [deltaX, deltaY] = [clientX - initX, clientY - initY]
			const newLat = viewport.latitude + deltaY / latPixels
			const newLng = viewport.longitude + deltaX / lngPixels

			const newViewport = { ...viewport }
			newViewport.latitude = newLat
			newViewport.longitude = newLng

			if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
				setLoading(true)
				setViewport(newViewport)
			}
			document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onDragEnd)
		}
		document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onDragEnd)
	}


	const handleDoubleClick = (e) => {
		const isTouchEvent = e.type === 'touchstart'
		const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX
		const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY

		const latRange = Math.abs(bounds[1][0] - bounds[0][0])
		const lngRange = Math.abs(bounds[1][1] - bounds[0][1])
		const NW = [bounds[1][0], bounds[0][1]]
		const latPixels = height / latRange
		const lngPixels = width / lngRange

		const newLat = NW[0] - clientY / latPixels
		const newLng = NW[1] + clientX / lngPixels

		const newViewport = { ...viewport }
		newViewport.latitude = newLat
		newViewport.longitude = newLng
		newViewport.zoom++

		setViewport(newViewport)
	}


	const handleClicks = (e) => {
		clearTimeout(timer.current)
		const clickCount = e.type === 'touchend' ? e.changedTouches.length : e.detail
		if (clickCount === 1) {
			timer.current = setTimeout(() => handleDrag(e), 50)
		} else if (clickCount === 2) {
			handleDoubleClick(e)
		}
	}


	return (
		<div id='myplotlydiv' onMouseDown={handleClicks}>
			{data && <Plot
				data={plotData}
				layout={layout}
				config={config}
				style={{ opacity: '0.7', position: 'absolute', top: '0', left: '0', zIndex: '2' }}
			/>
			}
		</div>
	)
}