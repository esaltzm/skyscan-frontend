import React from 'react'
import Plot from 'react-plotly.js'
import useWindowDimensions from '../WindowDimensions'

export default function DataLayer({ data, param, loading, setLoading }) {
	const { height, width } = useWindowDimensions()
	const units = {
		't': '°F',
		'gust': 'mph',
		'prate': 'mm/hour',
		'sde': 'ft',
		'ltng': '' // unitless param
	}

	if (data) {
		var plotData = [{
			x: data.map(d => d[1]),
			y: data.map(d => d[0]),
			z: data.map(d => d[2]),
			type: 'contour',
			showscale: false,
			contours: { coloring: 'heatmap' },
			line: { width: 0 },
			marker: { opacity: 0.5 },
			hovertemplate: `<i>${param} (${units[param]})</i>: %{z:.2f}<extra></extra>`,
		}]
	}

	if (plotData) {
		switch (param) {
			case ('t'):
				plotData[0].colorscale = [[0, 'rgb(150,0,255)'], [0.15, 'rgb(0,0,255)'], [0.3, 'rgb(83,236,255)'], [0.5, 'rgb(255,255,255)'], [0.7, 'rgb(255,224,52)'], [1, 'rgb(255,0,0)']]
				plotData[0].z = plotData[0].z.map(t => t * 1.8 + 32) // C to F
				break
			case ('prate'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.8, 'rgb(0,100,255'], [1, 'rgb(150,0,255)']]
				break
			case ('gust'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.15, 'rgb(255,255,255'], [0.6, 'rgb(255,255,0)'], [0.7, 'rgb(255,150,0)'], [0.85, 'rgb(255,0,0)'], [1, 'rgb(150,0,255)']]
				plotData[0].z = plotData[0].z.map(g => g * 2.23694) // m/s to mph
				break
			case ('sde'):
				plotData[0].colorscale = [[0, 'rgb(0,0,0)'], [1, 'rgb(255,255,255)']]
				plotData[0].z = plotData[0].z.map(d => d * 3.28084) // m to ft
				break
			case ('ltng'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255)'], [0.7, 'rgb(255,255,255)'], [0.8, 'rgb(0,255,255'], [0.9, 'rgb(125,255,0)'], [1, 'rgb(255,255,0)']]
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
		autosize: true,
		dragmode: false,
		width: width,
		height: height
	}

	const config = {
		displayModeBar: false,
		onAfterPlot: console.log('config done')
	}

	const handleDrag = (e) => {
		console.log('Drag started at: ', e.clientX, e.clientY)
		let initX = e.clientX, initY = e.clientY
		const onDragEnd = (e) => {
			console.log('Drag ended at: ', e.clientX, e.clientY)
			console.log(`Delta x: ${e.clientX - initX}, Delta y: ${e.clientY - initY}`)
			document.removeEventListener('mouseup', onDragEnd)
		}
		document.addEventListener('mouseup', onDragEnd)
	}

	return (
		<div onMouseDown={handleDrag}>
			{data && <Plot
				data={plotData}
				layout={layout}
				config={config}
				style={{ opacity: '0.7', position: 'absolute', top: '0', left: '0', zIndex: '2' }}
				onAfterPlot={() => {
					setLoading(false)
					console.log('plot complete')
				}}
			/>}
			{loading && <div style={{ position: 'absolue', top: '0', left: '0', zIndex: '200' }}>LOADING</div>}
		</div>
	)
}