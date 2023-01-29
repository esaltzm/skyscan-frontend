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
				plotData[0].colorscale = [[0, 'rgb(150,0,255)'], [0.2, 'rgb(0,0,255)'], [0.4, 'rgb(83,236,255)'], [0.5, 'rgb(255,255,255)'], [0.6, 'rgb(255,224,52)'], [0.8, 'rgb(255,0,0)'], [1, 'rgb(150,0,0)']]
				plotData[0].z = plotData[0].z.map(t => t * 1.8 + 32) // C to F
				console.log(Math.min(...plotData[0].z), Math.max(...plotData[0].z))
				console.log(paramRange['min'], paramRange['max'])
				const zmin = paramRange['min'] + Math.abs(Math.min(...plotData[0].z) - paramRange['min']) / 2
				const zmax = paramRange['max'] - Math.abs(Math.max(...plotData[0].z) - paramRange['max']) / 2
				plotData[0].zauto = false
				plotData[0].zmin = zmin
				plotData[0].zmax = zmax
				break
			case ('prate'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.8, 'rgb(0,100,255'], [1, 'rgb(150,0,255)']]
				plotData[0].z = plotData[0].z.map(d => d * 1000)
				break
			case ('gust'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.15, 'rgb(255,255,255'], [0.6, 'rgb(255,255,0)'], [0.7, 'rgb(255,150,0)'], [0.85, 'rgb(255,0,0)'], [1, 'rgb(150,0,255)']]
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
		const latRange = bounds[1][0] - bounds[0][0]
		const lngRange = bounds[1][1] - bounds[0][1]
		const latPixels = height / latRange
		const lngPixels = width / lngRange * -1
		let initX = e.clientX, initY = e.clientY
		const layer = document.getElementsByClassName('dragcover')[0]
		layer.style.cursor = 'grab'
		const onDragEnd = (e) => {
			const [deltaX, deltaY] = [e.clientX - initX, e.clientY - initY]
			const newLat = viewport.latitude + deltaY / latPixels
			const newLng = viewport.longitude + deltaX / lngPixels
			const newViewport = { ...viewport }
			newViewport.latitude = newLat
			newViewport.longitude = newLng
			if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
				setLoading(true)
				setViewport(newViewport)
			}
			document.removeEventListener('mouseup', onDragEnd)
		}
		document.addEventListener('mouseup', onDragEnd)
	}

	const handleDoubleClick = (e) => {
		const latRange = Math.abs(bounds[1][0] - bounds[0][0])
		const lngRange = Math.abs(bounds[1][1] - bounds[0][1])
		const NW = [bounds[1][0], bounds[0][1]]
		const latPixels = height / latRange
		const lngPixels = width / lngRange
		const newLat = NW[0] - e.clientY / latPixels
		const newLng = NW[1] + e.clientX / lngPixels
		const newViewport = { ...viewport }
		newViewport.latitude = newLat
		newViewport.longitude = newLng
		newViewport.zoom++
		setViewport(newViewport)
	}

	const handleClicks = (e) => {
		clearTimeout(timer.current)
		if (e.detail === 1) {
			timer.current = setTimeout(handleDrag(e), 50)
		} else if (e.detail === 2) {
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