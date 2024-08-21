import React, { use, useEffect, useState } from 'react';
import './Drawer.css';
import Image from "next/image";
import { LatLngExpression, Map, Popup } from 'leaflet';

interface DrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  data?: Array<any>
  selectedIdx?: number,
  onContentClick?: (input:any) => void,
  headerHeight: number
  mapRef?: Map | null
}

export const PannellumDrawer: React.FC<DrawerProps> = ({ isOpen, data, selectedIdx, onContentClick, headerHeight }) => {
  const handleSelected = (i: number) => {
    if (i == selectedIdx) return;
    if (!data || !onContentClick) return;

    onContentClick(i);
  }

  const isSelected = (i: number) => {
    if (i == selectedIdx) return true
    return false
  }

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}
      style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}>
      <div className="drawer-content">
        {data?.map((area, index: number) => (
          <div className={`content-container ${isSelected(index) ? 'selected-item' : ''}`} key={index} onClick={() => handleSelected(index)}>
            <Image className={'image'} src={area.url_preview} alt="img" fill={true} priority />
            <span className='textOverlay'>{area.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MapDrawer : React.FC<DrawerProps> = ({ isOpen, data, headerHeight, mapRef }) => {
  const handleSelected = (i: number) => {
    if (!data) return;
    const position = data[i].position
    const targetPos:LatLngExpression = [position.latitude, position.longitude]
    mapRef?.flyTo(targetPos, 18, {
        duration: 1.5,
    });
  }

  return  (
    <div className={`drawer ${isOpen ? 'open' : ''}`}
      style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}>
      <div className="drawer-content">
        {data?.map((area, index: number) => (
          <div className={`content-container`} key={index} onClick={() => handleSelected(index)}>
            <Image className={'image'} src={area.popupImgUrl} alt="img" fill={true} priority />
            <span className='textOverlay'>{area.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}