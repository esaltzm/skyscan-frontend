# SkyScan - Weather Visualization App

## Description:
This app was built to visualize the weather data I extracted from the [NOAA RAP weather model](https://www.ncei.noaa.gov/products/weather-climate-models/rapid-refresh-update). It was build using the React framework, routing requests through a [Node/Express backend](https://github.com/esaltzm/skyscan-backend), which in turn queries an [AWS MariaDB database](https://github.com/esaltzm/weather-api) containing weather data for the continental U.S. going back one year. 
The app displays a map using a Mapbox object created using the [react-map-gl](https://visgl.github.io/react-map-gl/) library, and plots data over the map using [react-plotly.js](https://plotly.com/javascript/react/)

