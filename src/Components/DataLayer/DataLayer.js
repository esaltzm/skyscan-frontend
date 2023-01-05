import React from 'react'
import Plot from 'react-plotly.js'
import useWindowDimensions from '../WindowDimensions'

export default function DataLayer({ data, setData }) {

	const { height, width } = useWindowDimensions()
	const param = 'gust'
	const unit = 'm/s'

	if (data) {
		console.log('data length: ', data.length)
		var plotData = [{
			x: data.map(d => d[1]),
			y: data.map(d => d[0]),
			z: data.map(d => d[2]),
			type: 'contour',
			showscale: false,
			colorscale: [[0, 'rgb(150,0,255)'], [0.1, 'rgb(0,0,255)'], [0.25, 'rgb(83,236,255)'], [0.5, 'rgb(255,255,255)'], [0.7, 'rgb(255,224,52)'], [1, 'rgb(255,0,0)']],
			contours: { coloring: 'heatmap' },
			line: { width: 0 },
			marker: { opacity: 0.5 },
			hovertemplate: `<i>${param} ${unit}</i>: %{z:.2f}<extra></extra>`,
		}]
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
		width: width,
		height: height
	}

	return (
		<div>
			{data && <Plot
				data={plotData}
				layout={layout}
				style={{ opacity: '0.7', position: 'absolute', top: '0', left: '0', zIndex: '2' }}
			/>}
		</div>
	)
}