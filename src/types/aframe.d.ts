import { Entity } from 'aframe-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-camera': any;
      'a-box': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-plane': any;
      'a-sky': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-cursor': any;
      'a-animation': any;
      'a-image': any;
      // Add any other A-Frame elements you might use
    }
  }
}