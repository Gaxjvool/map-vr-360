'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression, LatLngBoundsExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import MapHeader from './components/Map/MapHeader/MapHeader';
import CustomPopup from './components/Map/MapCustomPopup/MapCustomPopup'
import MapRef from './components/Map/MapRef/MapRef';

import placesData from '../data/demo.json'
import border from '../data/district-border.json'
import { MapDrawer } from './components/Drawer/Drawer';

const MapContainer = dynamic(() => import('react-leaflet').then(module => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(module => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(module => module.Marker), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(module => module.Polygon), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(module => module.Tooltip), { ssr: false });
// const MarkerClusterGroup = dynamic(() => import('./components/MarkerClusterGroup/MarkerClusterGroup'), {
//     ssr: false
//   });

const Page = () => {
    const [customIcon, setCustomIcon] = useState(null);
    const [polygon, setPolygon] = useState<any>([])
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [map, setMap] = useState<Map | null>(null);

    const latLngExpressionConvert = ({ latitude, longitude }: { latitude: number; longitude: number; }) => {
        const pos: LatLngExpression = [latitude, longitude]
        return pos
    }

    useEffect(() => {
        const L = require('leaflet');
        const icon = L.icon({
            iconUrl: '/assets/icons/Marker.svg', // Path to your custom icon image
            iconSize: [36, 50], // Size of the icon
            iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
        });
        setCustomIcon(icon);

        // const url = `https://nominatim.openstreetmap.org/search.php?city=Hong+Bang+District&country=Vietnam&polygon_geojson=1&format=jsonv2`
        // const haiphongUrl = `https://nominatim.openstreetmap.org/search.php?city=haiphong&country=Vietnam&polygon_geojson=1&format=jsonv2`
        // fetch(url).then(function (response) {
        //     return response.json();
        // })
        //     .then(function (json) {
        //         const geojsonFeature = json[0].geojson;
        //         const a: Array<Array<number>> = geojsonFeature.type == "MultiPolygon" ?
        //                                         geojsonFeature.coordinates[0][0] :
        //                                         geojsonFeature.coordinates[0]
        //         const swappedCoordinates = a.map(([longitude, latitude]) => [latitude, longitude]);

        //         setPolygon(swappedCoordinates)
        //     });

        const a: Array<Array<number>> = border.coordinates
        setPolygon(a)
    }, []);

    if (!customIcon) {
        return null; // Return null or a loader while the custom icon is being set
    }

    const position: LatLngExpression = [20.87387250085251, 106.63718240833545];
    const position2: LatLngExpression = [20.8288, 106.6915];
    const bounds: LatLngBoundsExpression = [
        [20.6, 107.1], // Southwest coordinates
        [21.1, 106.3]  // Northeast coordinates
    ];

    const polygonStyle = {
        color: 'red', // Outline color
        weight: 2, // Outline weight
        dashArray: '5, 10', // Dashing pattern (5 pixels dashed, 10 pixels gap)
        fillColor: '#02b6ee',
        fillOpacity: 0.1, // Transparent fill color
    }

    return (
        <>
            <MapHeader isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={true}
                zoomControl={false}
                style={{ height: '100vh', width: '100vw' }}
                maxBounds={bounds}
                minZoom={11}
                maxZoom={18}
                doubleClickZoom={false}
                attributionControl={false}>
                <TileLayer
                    attribution="Google Maps"
                    url="https://www.google.com/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                />
                {/* <MarkerClusterGroup> */}
                {placesData.map((place, index) => (
                    <Marker key={place.place_id} position={latLngExpressionConvert(place.position)} icon={customIcon}>
                        <CustomPopup
                            position={latLngExpressionConvert(place.position)}
                            content={place.name}
                            id={place.place_id}
                            popupImgUrl={place.popupImgUrl}
                        />
                        <Tooltip direction='right' offset={[8, -14]}>
                            <span>{place.name}</span>
                        </Tooltip>
                    </Marker>
                ))}
                {/* </MarkerClusterGroup> */}
                <Polygon pathOptions={polygonStyle} positions={polygon} />
                <MapRef setMapRef={setMap} />
            </MapContainer>
            <MapDrawer isOpen={isDrawerOpen} headerHeight={56} data={placesData} mapRef={map} />
        </>
    );
};


export default Page;