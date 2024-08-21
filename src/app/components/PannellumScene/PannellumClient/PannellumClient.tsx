'use client';
import React, { useEffect, useRef, useState } from 'react';
import placeData from '@/data/demo.json'
import Image from 'next/image';
import dynamic from 'next/dynamic';
import './PannellumClient.css'

const Pannellum = dynamic(() => import('@/app/components/PannellumScene/Pannellum/Pannellum'), {
  ssr: false
}); const PannellumHeader = dynamic(() => import('@/app/components/PannellumScene/PannellumHeader/PannellumHeader'), {
  ssr: false
}); const PannellumDrawer = dynamic(() => import('@/app/components/Drawer/Drawer').then(module => module.PannellumDrawer), {
  ssr: false
}); const Modal = dynamic(() => import('@/app/components/Modal/Modal'), {
  ssr: false
});

interface PannellumClientProps {
  id: string;
}

const PannellumClient = ({ id }: PannellumClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [index, setIndex] = useState(0);
  const [isMute, setMute] = useState<boolean>(true);
  const [isAudioPlaying, setAudioPlaying] = useState(false);
  const [isAutoRotate, setAutoRotate] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgMUsicRef = useRef<HTMLAudioElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const place = placeData.find((p) => p.place_id.toString() === id);

  useEffect(() => {
    if (!isMute) {
      setAudioPlaying(true)
      bgMUsicRef.current?.play()
    } else {
      setAudioPlaying(false)
      bgMUsicRef.current?.pause()
    }
  }, [isMute])

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current?.play()
      } else {
        audioRef.current?.pause()
      }
    }
  }, [isAudioPlaying])

  //khong cho chay khi reload
  useEffect(() => {
    if (audioRef.current && 
      bgMUsicRef.current
    ) {
      audioRef.current.volume = 0.1
      audioRef.current.loop = true
      bgMUsicRef.current.volume = 0.1
      bgMUsicRef.current.loop = true
    }
    //auto turn on audio bypass
    divRef.current?.addEventListener('mouseover', () => setMute(false), { once: true });
  }, []);

  const handleVolumeToggle = () => {
    if(!isMute) {setAudioPlaying(!isAudioPlaying)}
  }

  return (
    <>
      {
        !place ? <div>Loading...</div> : !place ? <h3>Place not found</h3> :
          <div ref={divRef}>
            <PannellumHeader
              id={id}
              title={place.name}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              setIsModalOpen={setIsModalOpen}
              panoramaIndex={index}
              setPanoramaIndex={setIndex}
              panoramaListLength={place.areas.length}
              isMute={isMute}
              setMute={setMute}
              isAutoRotate={isAutoRotate}
              setAutoRotate={setAutoRotate}
              place={place}
            />
            <Pannellum data={place.areas} index={index} setIndex={setIndex} isAutoRotate={isAutoRotate}/>
            <PannellumDrawer isOpen={isDrawerOpen} headerHeight={64} selectedIdx={index} data={place?.areas} onContentClick={setIndex} />
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }}>
              <h2 style={{ color: '#FFB801' }}>{place.name}</h2>
              <br/>
              <p style={{ color: 'black' , whiteSpace: 'pre-line', fontSize: '1.1rem',lineHeight: '1.5rem'}}>{place.text_desc}</p>
            </Modal>
            <div>
              <audio ref={audioRef} src={place.audio} />
              <audio ref={bgMUsicRef} src={'/assets/audio/bg_music.mp3'} />
            </div>
            <div className='guide-audio' onClick={handleVolumeToggle}>
              <Image src={isAudioPlaying ? '/assets/image/mc-animation.webp' : '/assets/image/mc.png'} width={144} height={258} alt='tour guider' priority />
              <Image src={isAudioPlaying ? '/assets/icons/sm_vol_on.svg' : '/assets/icons/sm_vol_off.svg'} width={23} height={23} alt='audio volume' className='volume-control' />
            </div>
          </div>
      }</>
  );
};

export default PannellumClient;