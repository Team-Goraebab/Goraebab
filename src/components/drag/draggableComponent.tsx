'use client'

import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { TransformProvider } from '@/context/useTransformContext';

const DraggableComponent: React.FC<{ isHandMode: boolean }> = ({
  isHandMode,
}) => {
  return (
    <Draggable disabled={isHandMode}>
      <div
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isHandMode ? 'default' : 'grab',
        }}
      >
        <h2>Drag me!</h2>
      </div>
    </Draggable>
  );
};

export default DraggableComponent;
