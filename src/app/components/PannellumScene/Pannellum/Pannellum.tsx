import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import 'pannellum'
const pano = '../assets/pano.jpg';
// import 'pannellum/src/js/libpannellum'
// import 'pannellum/src/js/pannellum'
import 'pannellum/src/css/pannellum.css'
import './Pannellum.css'

interface Scene {
    type: string;
    panorama: string;
    hotSpots: {
        pitch: number;
        yaw: number;
        type: string;
        // cssClass: string;
    }[];
}

interface Scenes {
    [key: string]: Scene
}

interface PannellumProps {
    data: {
        area_id: string;
        name: string;
        url: string;
        hotSpots: {
            pitch: number;
            yaw: number;
            type: string;
            sceneId: string;
        }[];
    }[],
    index: number,
    setIndex: React.Dispatch<number>,
    isAutoRotate: boolean
}

function Pannellum({ data, index, setIndex, isAutoRotate }: PannellumProps) {
    const pannellumRef = useRef<any>(null);
    const viewerRef = useRef<any>(null);
    const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
    const [scenes, setScenes] = useState<Scenes>({})

    const onHotSpotClicked = (e: PointerEvent, clickHandlerArgs: any) => {
        const { pitch, yaw, sceneId, type } = clickHandlerArgs
        if(type === 'info') {
            window.open(sceneId)
        }
        else {
            viewerRef.current.lookAt(pitch, yaw, 80, 700, toHostSpotScene, { sceneId })
        }
    }

    const toHostSpotScene = (args: any) => {
        viewerRef.current.loadScene(args.sceneId)
    }

    const handleChangeScene = (): void => {
        var index = data.findIndex(area => area.area_id == viewerRef.current.getScene());
        setIndex(index)
    }

    const setupScenes = () => {
        const temp: Scenes = {}
        data.forEach((area, index) => {
            temp[area.area_id] = {
                type: "equirectangular",
                panorama: area.url,
                hotSpots: area.hotSpots.map(hotSpot => ({
                    pitch: hotSpot.pitch,
                    yaw: hotSpot.yaw,
                    type: hotSpot.type,
                    cssClass: hotSpot.type === 'info' ? "custom-img-hotspot" : "custom-scene-hotspot",
                    clickHandlerFunc: onHotSpotClicked,
                    clickHandlerArgs: {
                        pitch: hotSpot.pitch,
                        yaw: hotSpot.yaw,
                        sceneId: hotSpot.sceneId,
                        type: hotSpot.type
                    }
                })),
            }
        })
        setScenes(temp)
    }

    useEffect(() => {
        let timeout: any
        if (viewerRef.current) {
            if (isAutoRotate) {
                viewerRef.current.startAutoRotate(-2)
                viewerRef.current.getConfig().autoRotateInactivityDelay = 1000
            }
            else {
                timeout = setTimeout(() => {
                    viewerRef.current.stopAutoRotate()
                }, 100)
            }
        }
        return () => {
            if(timeout) clearTimeout(timeout)
        }
    }, [isAutoRotate, index]);

    //might remove this
    useEffect(() => {
        const checkPannellum = () => {
            if (window.pannellum) {
                setIsPannellumLoaded(true);
            } else {
                const wait = setTimeout(checkPannellum, 100);
                clearTimeout(wait);
            }
        };
        checkPannellum();
        setupScenes()
    }, []);

    useEffect(() => {
        if (isPannellumLoaded && pannellumRef.current) {
            const panDefault = {
                "firstScene": data[0].area_id,
                "sceneFadeDuration": 1000,
                "autoLoad": true,
                "autoRotate": -2,
                "autoRotateInactivityDelay": 1000,
                "showZoomCtrl": false
            }

            viewerRef.current = window.pannellum.viewer(pannellumRef.current, {
                "default": panDefault,
                "scenes": scenes
            });
            window.addEventListener("resize", () => {
                const height = window.screen.availHeight
                const width = window.screen.availWidth
    
                if(width<height) {
                  // portrait
                  viewerRef.current.setHfov(60); 
                  viewerRef.current.setHfovBounds([55,75])
                } else {
                  // landscape
                  viewerRef.current.setHfov(100);
                  viewerRef.current.setHfovBounds([90,110])
                }
            }, false);
            viewerRef.current.on('scenechange', handleChangeScene)
        }
        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
            }
        }
    }, [isPannellumLoaded, data]);

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.loadScene(data[index].area_id)
        }
    }, [data, index])

    return (
        <div
            ref={pannellumRef}
            style={{ width: '100%', height: 'calc(100vh - 69px)' }}
        ></div>
    );
}

export default Pannellum;