import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Map } from 'leaflet'
interface mapRefProps {
    setMapRef: React.Dispatch<Map>,
}

const MapRef = ({ setMapRef } : mapRefProps) => {
    const map = useMap();
  
    useEffect(() => {
    setMapRef(map);
    }, [map, setMapRef]);
  
    return null;
}

export default MapRef