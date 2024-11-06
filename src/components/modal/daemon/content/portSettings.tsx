'use client';

import React, { useState } from 'react';

interface PortSettingsProps {
  portSettings: { privatePort: number; publicPort: number };
  setPortSettings: React.Dispatch<
    React.SetStateAction<{ privatePort: number; publicPort: number }>
  >;
}

const PortSettings = ({ portSettings, setPortSettings }: PortSettingsProps) => {
  const [tempPortSettings, setTempPortSettings] = useState({
    privatePort: portSettings.privatePort.toString(),
    publicPort: portSettings.publicPort.toString(),
  });
  const [errors, setErrors] = useState<{
    privatePort?: string;
    publicPort?: string;
  }>({});

  const validate = () => {
    const newErrors: { privatePort?: string; publicPort?: string } = {};
    if (!tempPortSettings.privatePort) {
      newErrors.privatePort = '프라이빗 포트를 입력해 주세요.';
    }
    if (!tempPortSettings.publicPort) {
      newErrors.publicPort = '퍼블릭 포트를 입력해 주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    setPortSettings({
      privatePort: Number(tempPortSettings.privatePort),
      publicPort: Number(tempPortSettings.publicPort),
    });
  };

  return (
    <div>
      <div className="mb-6 space-y-1">
        <label>프라이빗 포트 (필수)</label>
        <input
          type="text"
          value={tempPortSettings.privatePort}
          placeholder="예시) 5432"
          onChange={(e) =>
            setTempPortSettings({
              ...tempPortSettings,
              privatePort: e.target.value,
            })
          }
          className={`w-full p-2 border rounded ${
            errors.privatePort ? 'border-red_6' : ''
          }`}
          required
        />
        {errors.privatePort && (
          <p className="text-red_6 text-xs">{errors.privatePort}</p>
        )}
      </div>
      <div className="mb-6 space-y-1">
        <label>퍼블릭 포트 (필수)</label>
        <input
          type="text"
          value={tempPortSettings.publicPort}
          placeholder="예시) 8080"
          onChange={(e) =>
            setTempPortSettings({
              ...tempPortSettings,
              publicPort: e.target.value,
            })
          }
          className={`w-full p-2 border rounded ${
            errors.publicPort ? 'border-red_6' : ''
          }`}
          required
        />
        {errors.publicPort && (
          <p className="text-red_6 text-xs">{errors.publicPort}</p>
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

export default PortSettings;
