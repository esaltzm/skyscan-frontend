# SkyScan - Weather Visualization App

## Description:

This project was designed to visualize the weather data I extracted from the [NOAA RAP weather model](https://www.ncei.noaa.gov/products/weather-climate-models/rapid-refresh-update). It was build using the React framework, routing requests through a [Node/Express backend](https://github.com/esaltzm/skyscan-backend), which in turn queries an [AWS MariaDB database](https://github.com/esaltzm/weather-api) containing weather data for the continental U.S. going back one year. 


## Technologies used

- React
- [react-map-gl](https://visgl.github.io/react-map-gl/) was used to display the Mapbox element at the base layer of the page
- [react-plotly.js](https://plotly.com/javascript/react/) was used to visualize a weather data layer over the map

## Features

![screenshot of app showing temp heatmap over u.s.](https://i.imgur.com/3W2yjpK.png)
- Buttons to change zoom level of map and time of interest
- Select to choose weather parameter of interest (database contains temperature, wind speed, precipitation rate, snow depth, and lightning)


## Code Snippets

- Alter data received from request, plotting it as a heatmap with a gradient assigned based on range of values:

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
            hovertemplate: `<i>${param} (${units[param]})</i>: %{z:.2f}<extra></extra>`,
          }]
          
- On map viewport change (zooming in or out), get bounding coordinates of new map to pass as props to request for updated data:

          const mapRef = useRef(null)
          const alterBounds = () => {
              const [sw, ne] = Object.values(mapRef.current.getBounds())
              const [swLng, swLat] = Object.values(sw)
              const [neLng, neLat] = Object.values(ne)
              setBounds([[swLat, swLng], [neLat, neLng]])
          }
          useEffect(() => {
              mapRef.current && alterBounds()
          }, [viewport])
          
## Problems and Solutions

### Page layers + interacting with the map
The react-map-gl library provides a react component called NavigationControl, which is a child of the Map component and is used to change the viewport (zoom in and out, and rotate compass direction), and the Map component supports mouse drag events to shift the viewport laterally. But after layering a transparent Plotly heatmap over the Map component, users could no longer interact with the map at all.
<br/><em>As a solution, I created my own navigation control component which was not a child of the map, and could therefore have a higher z-index allowing it to be clicked on. The custom Nav component interacts with the map based on the viewport state, altering zoom on click. This navigation control only supports zooming in and out, but allows some degree of interactivity with the map, which was the goal</em>

### Plotly failing on plotting big datasets
According to my [research](https://community.plotly.com/t/how-much-data-can-plotly-charts-handle/16), Plotly should be able to handle up to 250,000 data points, but in practice, when presented with a single time and a view of the whole U.S. (~35,000 points), Plotly began to freeze up. I suspect the 250K limit is about simple line or scatter plots, and the heatmap I am using seems more complex, as it extrapolates data between points.
<br/><em>To solve this, I titrated the number of data points my chart could handle, which turned out to be just around 300. Even just 300 points provided smooth visual maps, so I then filtered any requests over this limit, allowing charts to render in a more timely manner.</em>

### Project scope and adjusting goals
I had initially planned for this project to be a photo sharing app where people could upload and share their photos, see them on a map, and get insights into the weather at the time/place their photos were taken. The reality was that this turned out to be an overly ambitious goal, considering that most of the project week was spent learning how to interact with AWS and parsing the obscure weather data files from the NOAA (loading the data alone took more than 2 days).
<br/><em>On realizing that I would not be able to complete that vision in the given timeframe, I quickly scaled back to just make a frontend that could prove that the database contained the data I selected from the NOAA model. I was inspired by the now offline darksky.net web app, which made weather data visually engaging and had a great UI.</em>

## Future Improvements
- Add support for dragging the map
- Clean up styling of nav bar and improve UI
- Test methods of rendering the data more quickly (takes ~5-10 seconds which in a real production environment would be unacceptable)
- Render heatmap colors based on fixed scale not dynamic depending on dataset - (ex. if the highest and lowest values on the data layer for temperature are only 5 degrees apart, do not render them as red and blue, but somewhere in the middle)
