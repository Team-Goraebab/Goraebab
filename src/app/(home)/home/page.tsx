'use client';

import { ZoomButtons, PanButtons } from '@/components';
import PanZoom from '@/components/function/panZoom';
import PinchZoom from '@/components/function/pinchZoom';
import { TransformProvider } from '@/context/useTransformContext';

const Home = () => {
  return (
    // <TransformProvider>
    <div
      style={{
        // width: '100vw',
        // height: '100vh',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* <div style={{ flex: 1 }}> */}
      {/* <ZoomButtons />
        <PanButtons /> */}
      {/* <PanZoom /> */}
      {/* </div> */}
      {/* <div style={{ flex: 1 }}>
        <PinchZoom />
      </div> */}
    </div>
    // </TransformProvider>
  );
};
export default Home;
