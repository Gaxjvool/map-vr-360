import React, { useEffect, useState } from 'react';
import 'aframe';
import { Entity, Scene } from 'aframe-react';
import './SceneTransition';
import { THREE } from 'aframe';

interface SceneChangedEvent extends CustomEvent {
  detail: { to: string };
}

interface SceneData {
  area_id: string;
  name: string;
  url: string;
  url_preview: string;
  hotSpots: {
    pitch: number;
    yaw: number;
    type: string;
    sceneId: string;
  }[];
}

interface VRViewProps {
  data: SceneData[];
  audioUrl: string
}

const VRView: React.FC<VRViewProps> = ({ data, audioUrl }) => {
  const [currentScene, setCurrentScene] = useState<SceneData>(data[0]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSceneChange = (event: SceneChangedEvent) => {
    const newScene = data.find(area => area.area_id === event.detail.to);
    if (newScene) {
      setCurrentScene(newScene);
    }
  };

  const handleSceneChangeWrapper = (event: Event) => {
    handleSceneChange(event as SceneChangedEvent);
  };


  useEffect(() => {
    const scene = document.querySelector('a-scene');
    const onLoaded = () => setIsLoading(false);

    if (scene) {
      scene.addEventListener('loaded', onLoaded);
    }
    document.addEventListener('sceneChanged', handleSceneChangeWrapper);
    return () => {
      document.removeEventListener('sceneChanged', handleSceneChangeWrapper);
      if (scene) {
        scene.removeEventListener('loaded', onLoaded);
      }
    };
  }, []);

  const pitchYawToCartesian = (pitch: number, yaw: number, radius = 12) => {
    // Convert degrees to radians
    const pitchRad = THREE.MathUtils.degToRad(pitch);
    const yawRad = THREE.MathUtils.degToRad(yaw);

    // Calculate the position
    const x = radius * Math.cos(pitchRad) * Math.sin(yawRad);
    const y = radius * Math.sin(pitchRad);
    const z = -radius * Math.cos(pitchRad) * Math.cos(yawRad);

    return { x, y, z };
  }

  return (
    <>
      {isLoading && (
        <div id="loadingScreen" style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          zIndex: 9999,
        }}>
          <div style={{ fontSize: '2em', fontFamily: 'sans-serif' }}>Loading...</div>
        </div>
      )}
    <Scene light="defaultLightsEnabled: false" scenelistener>
      <a-assets>
        {data.map((area, index) => (
          <img key={index} id={`#${area.area_id}`} src={area.url} />
        ))}
      </a-assets>

      <Entity id="skybox" primitive="a-sky" src={currentScene.url} position="0 0 0" rotation="0 -90 0" />
      <Entity position='0 0 0'>
        <Entity primitive="a-sound" src={`url(${audioUrl})`} autoplay="true" volume='0.5' />
      </Entity>
      {currentScene.hotSpots.map((hotspot, index) => {
        const position = pitchYawToCartesian(hotspot.pitch, hotspot.yaw);
        const pointerIcon = `/assets/icons/vr_pointer.svg`
        const imgIcon = `/assets/icons/img_icon.svg`
        if(hotspot.type === "info") return(<></>)
        return (
          <a-image
            key={index}
            src={pointerIcon}
            position={`${position.x} ${position.y} ${position.z}`}
            look-at="[camera]"   // This makes the hotspot always face the camera
            scene-transition={`to: ${hotspot.sceneId}`}
            billboard
            data-raycastable
          ></a-image>
        );
      })}

      <Entity id="cam_wrapper" rotation="0 0 0">
        <Entity primitive="a-camera" id="cam" position="0 0 0" wasd-controls={{ enabled: false, fly: false }}
                camera="fov:80" look-controls="touchEnabled: false"
                animation__zoomin="property:camera.fov;dur:600;to:60;startEvents:zoomin;"
                animation__zoomout="property:camera.fov;dur:400;to:80;startEvents:zoomout;">
          <Entity primitive="a-cursor" id="cursor-visual"
            cursor="fuse: true; fuseTimeout: 3000"
            raycaster="objects: [data-raycastable]"
            material="shader: flat; color: #000"
            // position="0 0 -0.5"
            geometry="primitive: ring;"
            animation="property: geometry.thetaLength; dir: alternate; dur: 250; easing: easeInSine; from:0;to: 360;startEvents:startFuseFix;pauseEvents:stopFuse;autoplay:false"
            animation__mouseenter="property: geometry.thetaLength; dir: alternate; dur: 2000; easing: easeInSine; from:360;to: 0;startEvents:startFuse;pauseEvents:stopFuse;autoplay:false"
            animation__mouseleave="property: geometry.thetaLength; dir: alternate; dur: 500; easing: easeInSine; to: 360;startEvents:stopFuse;autoplay:false"
          >
          </Entity>
          <Entity
                id="transition-plane"
                position="0 0 -0.2"  // Slightly in front of the camera
                rotation="0 0 0"
                width="16"  // Should be large enough to cover the entire camera view
                height="9"
                material="color: #000000; transparent: true; opacity: 0; alphaTest: 0.1"
                geometry="primitive: plane"
                animation__fadein="property: material.opacity; to: 1; dur: 300; startEvents: fadeIn"
                animation__fadeout="property: material.opacity; to: 0; dur: 200; startEvents: fadeOut"
              >
            </Entity>
        </Entity>
      </Entity>
    </Scene>
    </>
  );
};

export default VRView;