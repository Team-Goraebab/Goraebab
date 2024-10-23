'use client';

import React, { useState } from 'react';

interface NetworkSettingsProps {
  networkSettings: { gateway: string; ipAddress: string };
  setNetworkSettings: React.Dispatch<
    React.SetStateAction<{ gateway: string; ipAddress: string }>
  >;
}

const NetworkSettings = ({
  networkSettings,
  setNetworkSettings,
}: NetworkSettingsProps) => {
  const [errors, setErrors] = useState({ gateway: '', ipAddress: '' });

  const validate = () => {
    const newErrors: any = {};
    if (!networkSettings.gateway) {
      newErrors.gateway = '게이트웨이를 입력해 주세요.';
    }
    if (!networkSettings.ipAddress) {
      newErrors.ipAddress = 'IP 주소를 입력해 주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }
    // 저장 로직을 여기에 추가
  };

  return (
    <div>
      <div className="mb-6 space-y-1">
        <label>게이트웨이 (필수)</label>
        <input
          type="text"
          value={networkSettings.gateway}
          placeholder="예시) 192.168.1.1"
          onChange={(e) =>
            setNetworkSettings({ ...networkSettings, gateway: e.target.value })
          }
          className={`w-full p-2 border rounded ${
            errors.gateway ? 'border-red_6' : ''
          }`}
          required
        />
        {errors.gateway && (
          <p className="text-red_6 text-xs">{errors.gateway}</p>
        )}
      </div>
      <div className="mb-6 space-y-1">
        <label>IP 주소 (필수)</label>
        <input
          type="text"
          value={networkSettings.ipAddress}
          placeholder="예시) 192.168.1.100"
          onChange={(e) =>
            setNetworkSettings({
              ...networkSettings,
              ipAddress: e.target.value,
            })
          }
          className={`w-full p-2 border rounded ${
            errors.ipAddress ? 'border-red_6' : ''
          }`}
          required
        />
        {errors.ipAddress && (
          <p className="text-red_6 text-xs">{errors.ipAddress}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-2 py-1 flex items-center bg-grey_2 hover:bg-blue_1 rounded text-sm"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default NetworkSettings;
