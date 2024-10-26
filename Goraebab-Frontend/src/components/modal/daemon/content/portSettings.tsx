'use client';

import React, { useState } from 'react';

interface PortSettingsProps {
  portSettings: { privatePort: string; publicPort: string };
  setPortSettings: React.Dispatch<
    React.SetStateAction<{ privatePort: string; publicPort: string }>
  >;
}

const PortSettings = ({ portSettings, setPortSettings }: PortSettingsProps) => {
  const [errors, setErrors] = useState({ privatePort: '', publicPort: '' });

  const validate = () => {
    const newErrors: any = {};
    if (!portSettings.privatePort) {
      newErrors.privatePort = '프라이빗 포트를 입력해 주세요.';
    }
    if (!portSettings.publicPort) {
      newErrors.publicPort = '퍼블릭 포트를 입력해 주세요.';
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
        <label>프라이빗 포트 (필수)</label>
        <input
          type="text"
          value={portSettings.privatePort}
          placeholder="예시) 5432"
          onChange={(e) =>
            setPortSettings({ ...portSettings, privatePort: e.target.value })
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
          value={portSettings.publicPort}
          placeholder="예시) 8080"
          onChange={(e) =>
            setPortSettings({ ...portSettings, publicPort: e.target.value })
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
