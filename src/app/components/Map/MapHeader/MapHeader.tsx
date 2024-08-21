import React, { useState } from 'react';
import styles from './MapHeader.module.css';
import Image from "next/image";
import { Merriweather } from "next/font/google";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faListUl
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation';

interface MapHeaderProps {
  isDrawerOpen : boolean,
  setIsDrawerOpen : React.Dispatch<boolean>
}

const merriweather = Merriweather({
  subsets: ["vietnamese"],
  weight: "400"
});

const MapHeader = ({isDrawerOpen, setIsDrawerOpen} : MapHeaderProps) => {
  const languageIconSrc = '/assets/icons/language.svg'
  const volumeOnIconSrc = '/assets/icons/volume_on.svg'
  const imageSize = 20
  const router = useRouter();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleHomeBtn = () => {
    router.push(`/`)
  }

  return (
    <div className={styles.navBar}>
      <div className={styles.centerButtons}>
        <button className={styles.button} onClick={handleHomeBtn}>
          <FontAwesomeIcon icon={faHouse} style={{color: "#616161"}} size='lg'/>
        </button>
      </div>
      <div className={styles.sidebarButtonWrap}>
        <button className={styles.sidebarButton + ' ' + merriweather.className} onClick={toggleDrawer}>
          <FontAwesomeIcon icon={faListUl} className={styles.sideBtnIcon}/>
          <span className={styles.sideBtnText}>Danh sách địa điểm</span>
        </button>
      </div>
    </div>
  );
};

export default MapHeader;