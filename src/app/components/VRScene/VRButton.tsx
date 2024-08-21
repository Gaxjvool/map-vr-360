import React from 'react';
import styles from './VRButton.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

interface EnterVRButtonProps {
  onClickVR?: () => void;
  onClickReturn?: () => void;
}

const EnterVRButton: React.FC<EnterVRButtonProps> = ({ onClickVR, onClickReturn }) => {
  return (
    <>
    <div className={styles.vrContainer}>
      <button
        className={styles.vrButton}
        title="Enter VR mode with a headset or fullscreen mode on a desktop. Visit https://webvr.rocks or https://webvr.info for more information."
        onClick={onClickVR}
      >
      </button>
    </div>
    <div 
      onClick={onClickReturn} 
      className={styles.returnBtnContainer}
    >
      <FontAwesomeIcon icon={faShare} rotation={180} />
      <span className={styles.returnBtnText}> TRỞ VỀ BẢN ĐỒ TOÀN CẢNH</span>
    </div>
    </>
  );
};

export default EnterVRButton;