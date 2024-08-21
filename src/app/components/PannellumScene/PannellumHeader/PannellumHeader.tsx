import React, { useState } from 'react';
import Image from "next/image";
import styles from './PannellumHeader.module.css'
import { useRouter } from 'next/navigation';
import { LatLngTuple } from 'leaflet';
import { Merriweather } from "next/font/google";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faCircleInfo,
  faHouse,
  faListUl,
  faMapLocationDot,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
  faVrCardboard
} from '@fortawesome/free-solid-svg-icons'

interface PannellumHeaderProps {
  id:string
  title: string,
  isDrawerOpen: boolean,
  setIsDrawerOpen: React.Dispatch<boolean>,
  setIsModalOpen: React.Dispatch<boolean>,
  panoramaIndex: number,
  setPanoramaIndex: React.Dispatch<number>,
  panoramaListLength: number,
  isMute: boolean,
  setMute: React.Dispatch<boolean>,
  isAutoRotate: boolean,
  setAutoRotate: React.Dispatch<boolean>,
  place: any
}

const merriweather = Merriweather({
  subsets: ["vietnamese"],
  weight: "400"
});

const PannellumHeader = ({ 
  id,
  title,
  isDrawerOpen,
  setIsDrawerOpen,
  setIsModalOpen,
  panoramaIndex,
  setPanoramaIndex,
  panoramaListLength,
  isMute,
  setMute,
  isAutoRotate,
  setAutoRotate,
  place
}: PannellumHeaderProps) => {
  const router = useRouter()

  const playButtonColor = {
    filter: 'brightness(0) saturate(100%) invert(39%) sepia(0%) saturate(0%) hue-rotate(226deg) brightness(93%) contrast(86%)'
  }

  const handleReturn = () => {
    router.push(`/`)
  }

  const handleChangePanorama = (isLeft: boolean) => {
    let newIdx;
    if (isLeft) {
      newIdx = panoramaIndex == 0 ? panoramaListLength - 1 : panoramaIndex - 1;
    } else {
      newIdx = (panoramaIndex + 1) % panoramaListLength;
    }
    setPanoramaIndex(newIdx)
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(true);
  };

  const toggleMute = () => {
    setMute(!isMute)
  }

  const handleVRbtn = () => {
    router.push(`/viewVR/${id}`)
  }

  const toggleAutoRotate = () => {
    setAutoRotate(!isAutoRotate)
  }


  return (
    <div className={styles.navBar}>
      <div>
        <button onClick={handleReturn} className={styles.returnButton}>
          <span className={styles.returnText + ' ' + merriweather.className}>{'<Quay lại'}</span>
        </button>
      </div>
      <div className={styles.GeneralButtons}>
        <button className={styles.button} onClick={handleReturn}>
          <FontAwesomeIcon icon={faHouse} style={{color: "#616161"}} size="lg" fixedWidth />
        </button>
        <a className={styles.fakeButton}
          href={`https://www.google.com/maps/search/${place.mapRedirect ? place.mapRedirect : encodeURIComponent(place.name)}`}
          target="_blank"
        >
          <FontAwesomeIcon icon={faMapLocationDot} style={{color: "#616161"}} size="lg" fixedWidth />
        </a>
        <button className={styles.button} onClick={toggleMute}>
          <FontAwesomeIcon icon={isMute ? faVolumeXmark : faVolumeHigh} style={{color: "#616161"}} size="lg" fixedWidth />
        </button>
        <button className={styles.button} onClick={handleVRbtn}>
          <FontAwesomeIcon icon={faVrCardboard} style={{color: "#616161"}} size="lg" fixedWidth />
        </button>
      </div>
      <div className={styles.viewButtons}>
        <button className={styles.button} onClick={toggleModal}>
          <FontAwesomeIcon icon={faCircleInfo} style={{color: "#616161"}} size="lg" fixedWidth />
        </button>
        <button className={styles.button} onClick={() => handleChangePanorama(true)}>
          <FontAwesomeIcon icon={faArrowLeft} style={{color: "#616161"}} size="lg" fixedWidth />
        </button>
        <button className={styles.button} onClick={toggleAutoRotate}>
          <FontAwesomeIcon icon={isAutoRotate ? faPlay : faPause} style={{color: "#616161"}} size="lg" fixedWidth/>
        </button>
        <button className={styles.button} onClick={() => handleChangePanorama(false)}>
          <FontAwesomeIcon icon={faArrowRight} style={{color: "#616161"}} size="lg" fixedWidth />
        </button>
      </div>
      <div className={styles.sidebarButtonWrap}>
        <button className={styles.sidebarButton + ' ' + merriweather.className} onClick={toggleDrawer}>
          <FontAwesomeIcon icon={faListUl} size="lg" fixedWidth />
          <span className={styles.BtnTittle}>{title}</span>
        </button>
      </div>
    </div>
  );
};

export default PannellumHeader;