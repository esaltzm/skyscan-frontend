import React from 'react'
import Plot from 'react-plotly.js'
import useWindowDimensions from '../WindowDimensions'

export default function DataLayer({ data, param, loading, setLoading }) {
	const { height, width } = useWindowDimensions()
	const units = {
		't': '°C',
		'gust': 'm/s',
		'prate': 'kg/m2/s',
		'sde': 'm',
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
		console.log(param)
		switch (param) {
			case ('t'):
				plotData[0].colorscale = [[0, 'rgb(150,0,255)'], [0.15, 'rgb(0,0,255)'], [0.3, 'rgb(83,236,255)'], [0.5, 'rgb(255,255,255)'], [0.7, 'rgb(255,224,52)'], [1, 'rgb(255,0,0)']]
				break
			case ('prate'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.8, 'rgb(0,100,255'], [1, 'rgb(150,0,255)']]
				break
			case ('gust'):
				plotData[0].colorscale = [[0, 'rgb(255,255,255'], [0.15, 'rgb(255,255,255'], [0.6, 'rgb(255,255,0)'], [0.7, 'rgb(255,150,0)'], [0.85, 'rgb(255,0,0)'], [1, 'rgb(150,0,255)']]
				break
			case ('sde'):
				plotData[0].colorscale = [[0, 'rgb(0,0,0)'], [1, 'rgb(255,255,255)']]
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

	return (
		<div>
			{data && <Plot
				data={plotData}
				layout={layout}
				style={{ opacity: '0.7', position: 'absolute', top: '0', left: '0', zIndex: '2' }}
				onAfterPlot={() => {
					console.log('plot complete')
				}}
			/>}
		</div>
	)
}