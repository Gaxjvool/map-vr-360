import React from 'react';
import { useMap } from 'react-leaflet';
import './MapCustomPopup.css';
import Image from "next/image";
import { LatLngTuple, Popup as LeafletPopup } from 'leaflet';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay
} from '@fortawesome/free-solid-svg-icons'

interface CustomPopupProps {
  content: string;
  id: number;
  position: LatLngTuple;
  popupImgUrl: string
}

const Popup = dynamic(() => import('react-leaflet').then(module => module.Popup), { ssr: false });

const CustomPopup =  React.forwardRef<LeafletPopup, CustomPopupProps>((props, ref) => {
  const { content, id, position, popupImgUrl } = props;
  const map = useMap();
  const router = useRouter();

  const size = {
    width: 20,
    height: 20
  }

  const handleFlyTo = () => {
    map.flyTo(position, 18, {
      duration: 1,
    });
  };

  const handlePlay = () => {
    router.push(`/view360/${encodeURIComponent(id)}`);
  };

  return (
    <Popup ref={ref} closeButton={false}>
      <div className="custom-popup">
        <Image src={popupImgUrl} alt="Place" className="custom-popup-image" width={301} height={170} priority />
        <div className='custom-popup-lower-body'>
          <span className='custom-popup-p'>{content}</span>
          <div className="custom-popup-buttons">
            <button onClick={handlePlay}>
              <FontAwesomeIcon icon={faPlay} size='lg'/>
            </button>
            <button onClick={handleFlyTo}>
              <Image src={'/assets/icons/fly_to_icon.svg'} alt="FlyTo Icon" width={size.width} height={size.height} priority />
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
});

CustomPopup.displayName = 'CustomPopup';

export default CustomPopup;
