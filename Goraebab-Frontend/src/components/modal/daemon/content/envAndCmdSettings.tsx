'use client';

import React, { useState } from 'react';

interface EnvAndCmdSettingsProps {
  envVariables: string;
  setEnvVariables: React.Dispatch<React.SetStateAction<string>>;
  cmd: string;
  setCmd: React.Dispatch<React.SetStateAction<string>>;
}

const EnvAndCmdSettings = ({
  envVariables,
  setEnvVariables,
  cmd,
  setCmd,
}: EnvAndCmdSettingsProps) => {
  const [errors, setErrors] = useState({ envVariables: '', cmd: '' });

  const validate = () => {
    const newErrors: any = {};
    if (!envVariables) {
      newErrors.envVariables = '환경 변수를 입력해 주세요.';
    }
    if (!cmd) {
      newErrors.cmd = '명령어를 입력해 주세요.';
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
        <label>환경 변수 (줄바꿈으로 구분)</label>
        <textarea
          value={envVariables}
          placeholder="예시) POSTGRES_PASSWORD=mypassword\nPOSTGRES_DB=mydatabase"
          onChange={(e) => setEnvVariables(e.target.value)}
          rows={4}
          className={`w-full p-2 border rounded ${
            errors.envVariables ? 'border-red_6' : ''
          }`}
        />
        {errors.envVariables && (
          <p className="text-red_6 text-xs">{errors.envVariables}</p>
        )}
      </div>
      <div className="mb-6 space-y-1">
        <label>명령어 (줄바꿈으로 구분)</label>
        <textarea
          value={cmd}
          placeholder="예시) postgres\n-c\nconfig_file=/etc/postgresql/postgresql.conf"
          onChange={(e) => setCmd(e.target.value)}
          rows={4}
          className={`w-full p-2 border rounded ${
            errors.cmd ? 'border-red_6' : ''
          }`}
        />
        {errors.cmd && <p className="text-red_6 text-xs">{errors.cmd}</p>}
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

export default EnvAndCmdSettings;
