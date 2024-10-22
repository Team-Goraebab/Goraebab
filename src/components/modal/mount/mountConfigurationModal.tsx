'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  MenuItem,
  Select,
} from '@mui/material';

interface MountConfigProps {
  Type: string;
  Source: string;
  Destination: string;
  Mode: string;
  Propagation: string;
  Name: string;
}

interface MountProps {
  open: boolean;
  onClose: () => void;
  onSave: (mountConfig: MountConfigProps) => void;
}

const MountConfigurationModal = ({ open, onClose, onSave }: MountProps) => {
  const [mountType, setMountType] = useState<string>('bind'); // 'bind' or 'volume'
  const [sourcePath, setSourcePath] = useState<string>('');
  const [destinationPath, setDestinationPath] = useState<string>('');
  const [mode, setMode] = useState<string>('rw'); // 'rw' or 'ro'
  const [propagation, setPropagation] = useState<string>('');
  const [volumeName, setVolumeName] = useState<string>('');

  const handleSave = () => {
    const mountConfig = {
      Type: mountType,
      Source: mountType === 'bind' ? sourcePath : '',
      Destination: destinationPath,
      Mode: mode,
      Propagation: mountType === 'bind' ? propagation : '',
      Name: mountType === 'volume' ? volumeName : '',
    };
    onSave(mountConfig);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>마운트 설정</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            row
            value={mountType}
            onChange={(e) => setMountType(e.target.value)}
          >
            <FormControlLabel
              value="bind"
              control={<Radio />}
              label="바인드 마운트"
            />
            <FormControlLabel
              value="volume"
              control={<Radio />}
              label="볼륨 마운트"
            />
          </RadioGroup>
        </FormControl>

        {mountType === 'bind' && (
          <>
            <TextField
              fullWidth
              label="소스 경로 (호스트)"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="마운트 전파 설정"
              value={propagation}
              onChange={(e) => setPropagation(e.target.value)}
              margin="normal"
            />
          </>
        )}

        {mountType === 'volume' && (
          <TextField
            fullWidth
            label="볼륨 이름"
            value={volumeName}
            onChange={(e) => setVolumeName(e.target.value)}
            margin="normal"
          />
        )}

        <TextField
          fullWidth
          label="대상 경로 (컨테이너)"
          value={destinationPath}
          onChange={(e) => setDestinationPath(e.target.value)}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            displayEmpty
          >
            <MenuItem value="rw">읽기-쓰기</MenuItem>
            <MenuItem value="ro">읽기 전용</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MountConfigurationModal;
