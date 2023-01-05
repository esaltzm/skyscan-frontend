import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import DeckGL from 'deck.gl'
import { MapProvider, Map, NavigationControl } from 'react-map-gl';
import useWindowDimensions from '../WindowDimensions'

export default function DataMap() {
    const gustData = [[39.77075, -105.87626, 18.6531], [39.65349, -105.86401, 16.0281], [39.53616, -105.85179, 12.6531], [39.41877, -105.8396, 10.2156], [39.30131, -105.82743, 9.27809], [39.78011, -105.72373, 18.5906], [39.66285, -105.71165, 17.8406], [39.54551, -105.6996, 16.5906], [39.42811, -105.68758, 12.7781], [39.31064, -105.67558, 8.84059], [39.78934, -105.57117, 10.7781], [39.67207, -105.55926, 15.9656], [39.55473, -105.54738, 17.5281], [39.43732, -105.53553, 15.2156], [39.31985, -105.5237, 16.0281], [39.79843, -105.41859, 7.27809], [39.68116, -105.40685, 10.5906], [39.56381, -105.39514, 15.8406], [39.4464, -105.38345, 15.4656], [39.32892, -105.3718, 18.4656], [39.80739, -105.26597, 7.21559], [39.69011, -105.25441, 9.15309], [39.57276, -105.24287, 11.0906], [39.45535, -105.23135, 10.6531], [39.33786, -105.21986, 14.7156], [39.81622, -105.11334, 5.96559], [39.69894, -105.10194, 6.77809], [39.58158, -105.09057, 6.34059], [39.46416, -105.07923, 7.21559], [39.34667, -105.06791, 9.65309], [39.82492, -104.96067, 6.46559], [39.70763, -104.94945, 5.59059], [39.59027, -104.93825, 4.02809], [39.47284, -104.92708, 4.21559], [39.35535, -104.91593, 6.90309]]

    const { height, width } = useWindowDimensions();

    const data = gustData.map(([lat, lng, value]) => ({
        position: [lng, lat],
        value: value,
    }));

    const layer = new HeatmapLayer({
        id: 'data-layer',
        data,
        getPosition: d => d.position,
        colorRange: [[255, 255, 178], [254, 217, 118], [254, 178, 76], [253, 141, 60], [227, 26, 28]],
        intensity: 1,
        radiusPixels: 60,
    });

    return (
        <DeckGL
            width={width}
            height={height}
            layers={[layer]}
            initialViewState={{
                longitude: -105.5,
                latitude: 39.5,
                zoom: 7,
            }}
            controller={true}
            ContextProvider={MapProvider}
        >
            <Map
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                initialViewState={{
                    longitude: -96,
                    latitude: 37.8,
                    zoom: 4
                }}
                style={{ width: "100vw", height: "100vh", position: 'absolute', top: '0', left: '0', zIndex: '0' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                <div style={{ zIndex: '2' }}>
                    <NavigationControl position='top-left' />
                </div>
            </Map>
        </DeckGL>
    );
}