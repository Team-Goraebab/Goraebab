'use client';

import React from 'react';

const VolumePage = () => {
  const handleApiTest = async () => {
    try {
      const response = await fetch('/api/remote/daemon');

      if (response.ok) {
        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response:', data);
      } else {
        console.log('API 요청 실패');
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
    }
  };

  return (
    <>
      <h1>Management Dashboard</h1>
      <button onClick={handleApiTest}>Api test</button>
    </>
  );
};

export default VolumePage;
