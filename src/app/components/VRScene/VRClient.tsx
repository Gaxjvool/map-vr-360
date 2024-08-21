'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import jsonData from '../../../data/demo.json'
import { useRouter } from 'next/navigation';

const AFrameScene = dynamic(() => import('./VRView'), { ssr: false });
const VRButton = dynamic(() => import('./VRButton'), { ssr: false });
interface VRClientProps {
  id: string;
}

const VRClient = ({ id }: VRClientProps) => {
  const placeData = jsonData.find((p) => p.place_id.toString() === id);
  const router = useRouter();

  const clickVRButton = () => {
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.enterVR();
    }
  }
  if (!placeData) {
    return (
      <h1>Not Found</h1>
    )
  }

  const handleReturn = () => {
    router.push(`/`)
  }

  return (
    <div>
      <AFrameScene data={placeData.areas} audioUrl={placeData.audio} />
      <VRButton onClickVR={clickVRButton} onClickReturn={handleReturn} />
    </div>
  )
};

export default VRClient;