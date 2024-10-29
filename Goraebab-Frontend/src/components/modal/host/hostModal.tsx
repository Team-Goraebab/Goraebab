'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { colorsOption } from '@/data/color';
import { Host, Network, ThemeColor } from '@/types/type';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useHostStore } from '@/store/hostStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import {
  Box, Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel, InputLabel, MenuItem, Radio,
  RadioGroup, Select,
  TextField,
  Typography,
} from '@mui/material';

interface HostModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const HostModal = ({ isOpen, onClose }: HostModalProps) => {
  const id = uuidv4();
  const { enqueueSnackbar } = useSnackbar();
  const addHost = useHostStore((state) => state.addHost);
  const addConnectedBridgeId = selectedHostStore(
    (state) => state.addConnectedBridgeId,
  );

  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [hostNm, setHostNm] = useState<string>('');
  const [hostIp, setHostIp] = useState<string>('');
  const [networkName, setNetworkName] = useState<string>('');
  const [networkIp, setNetworkIp] = useState<string>('');
  const [availableNetworks, setAvailableNetworks] = useState<Network[]>([]);
  const [isHostIpConnected, setIsHostIpConnected] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(
    null,
  );

  const fetchNetworks = async () => {
    try {
      const response = await fetch(`/api/network/list?hostIp=${hostIp}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setAvailableNetworks(data);
      } else {
        setAvailableNetworks([]);
        console.error('The fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('네트워크 목록을 불러오는데 실패했습니다.', error);
      setAvailableNetworks([]);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, [hostIp, isHostIpConnected]);

  const handleAddHost = (): void => {
    if (useHostStore.getState().hosts.length >= 5) {
      showSnackbar(
        enqueueSnackbar,
        '호스트는 최대 5개까지만 추가할 수 있습니다.',
        'error',
        '#d32f2f',
      );
      return;
    }

    // 선택한 네트워크 정보 찾기
    const selectedNetwork = availableNetworks.find(
      (net) => net.Name === networkName,
    );

    if (!selectedNetwork) {
      showSnackbar(
        enqueueSnackbar,
        '선택된 네트워크를 찾을 수 없습니다.',
        'error',
        '#d32f2f',
      );
      return;
    }

    const newHost: Host = {
      id,
      hostNm,
      hostIp: isRemote ? hostIp : 'localhost',
      status: true,
      isRemote,
      themeColor: selectedColor,
      networks: [
        {
          id: selectedNetwork.Id,
          name: selectedNetwork.Name,
          ip: selectedNetwork.IPAM?.Config?.[0]?.Gateway || '',
          hostId: id,
          driver: selectedNetwork.Driver,
          subnet: selectedNetwork.IPAM?.Config?.[0]?.Subnet || '',
          networkUniqueId: uuidv4(),
          containers: [],
        },
      ],
    };

    addHost(newHost);

    addConnectedBridgeId(id, {
      uniqueId: uuidv4(),
      name: selectedNetwork.Name,
      gateway: selectedNetwork.IPAM?.Config?.[0]?.Gateway || '',
      driver: selectedNetwork.Driver || '',
      subnet: selectedNetwork.IPAM?.Config?.[0]?.Subnet || '',
      scope: selectedNetwork.Scope || '',
      id: selectedNetwork.Id,
    });

    showSnackbar(
      enqueueSnackbar,
      '호스트가 성공적으로 추가되었습니다!',
      'success',
      '#4CAF50',
    );
    onClose();
  };

  const defaultColor = colorsOption.find((color) => !color.sub);
  const defaultSubColor = colorsOption.find(
    (color) => color.label === defaultColor?.label && color.sub,
  );

  const [selectedColor, setSelectedColor] = useState<ThemeColor>({
    label: defaultColor?.label || '',
    bgColor: defaultSubColor?.color || '',
    borderColor: defaultColor?.color || '',
    textColor: defaultColor?.color || '',
  });

  useEffect(() => {
    if (availableNetworks.length > 0) {
      const firstNetwork = availableNetworks[0];
      setNetworkName(firstNetwork.Name);
      setNetworkIp(firstNetwork.IPAM?.Config?.[0]?.Gateway || '');
    }
  }, [availableNetworks]);

  const isSaveDisabled = useMemo(() => {
    if (isRemote) {
      return (
        !hostNm || !networkName || !networkIp || !hostIp || !isHostIpConnected
      );
    }
    return !hostNm || !networkName || !networkIp;
  }, [hostNm, networkName, networkIp, isRemote, hostIp, isHostIpConnected]);

  const handleNetworkChange = (selectedNetworkName: string) => {
    const selectedNetwork = availableNetworks.find(
      (net) => net.Name === selectedNetworkName,
    );
    setNetworkName(selectedNetworkName);
    setNetworkIp(selectedNetwork?.IPAM?.Config?.[0]?.Gateway || '');
  };

  const handleColorSelection = (colorLabel: string) => {
    const mainColor = colorsOption.find(
      (color) => color.label === colorLabel && !color.sub,
    );
    const subColor = colorsOption.find(
      (color) => color.label === colorLabel && color.sub,
    );

    setSelectedColor({
      label: colorLabel,
      bgColor: subColor?.color || '',
      borderColor: mainColor?.color || '',
      textColor: mainColor?.color || '',
    });
  };

  async function fetchConnectRemoteDaemon(hostIp: string) {
    try {
      const response = await axios.get(`/api/daemon/ping?hostIp=${hostIp}`);
      if (response.status === 200) {
        setIsHostIpConnected(true);
        setConnectionMessage('연결 성공');
      } else {
        setIsHostIpConnected(false);
        setConnectionMessage('원격 데몬 연결에 실패했습니다.');
      }
    } catch (error) {
      setIsHostIpConnected(false);
      setConnectionMessage('원격 데몬 연결에 실패했습니다.');
    }
  }

  const handleConnectClick = () => {
    if (hostIp) {
      fetchConnectRemoteDaemon(hostIp);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}  // 이벤트 버블링 방지
      slotProps={{
        backdrop: {
          onClick: () => onClose(),  // 백드롭 클릭시에만 닫히도록 설정
        },
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <div className="font-bold text-x">Create New Host</div>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={2}>
          <TextField
            label="Host Name"
            fullWidth
            value={hostNm}
            onChange={(e) => setHostNm(e.target.value)}
            variant="outlined"
            required
          />
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Host Type</Typography>
            <RadioGroup
              row
              value={isRemote ? 'remote' : 'local'}
              onChange={(e) => {
                setIsRemote(e.target.value === 'remote');
                if (e.target.value !== 'remote') {
                  setHostIp('localhost');
                  setIsHostIpConnected(false);
                  setConnectionMessage(null);
                }
              }}
            >
              <FormControlLabel
                value="local"
                control={<Radio />}
                label="Local"
              />
              <FormControlLabel
                value="remote"
                control={<Radio />}
                label="Remote"
              />
            </RadioGroup>
          </FormControl>
          {isRemote && (
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label="Host IP"
                fullWidth
                value={hostIp || ''}
                onChange={(e) => {
                  setHostIp(e.target.value);
                  setIsHostIpConnected(false);
                  setConnectionMessage(null);
                }}
                variant="outlined"
                required
                error={
                  connectionMessage !== null &&
                  connectionMessage !== '연결 성공'
                }
                helperText={connectionMessage}
              />
              <Button
                onClick={handleConnectClick}
                color="primary"
                variant="contained"
                disabled={!hostIp}
              >
                연결
              </Button>
            </Box>
          )}
          <FormControl fullWidth>
            <InputLabel>Select Network</InputLabel>
            <Select
              value={networkName}
              onChange={(e) => handleNetworkChange(e.target.value)}
              label="Select Network"
              fullWidth
              disabled={isRemote ? !isHostIpConnected : false}
            >
              {availableNetworks && availableNetworks.length > 0 ? (
                availableNetworks.map((net) => (
                  <MenuItem key={net.Id} value={net.Name}>
                    {net.Name} (IP: {net.IPAM?.Config?.[0]?.Gateway || 'None'})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>네트워크가 없습니다.</MenuItem>
              )}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" mb={1}>
              Select Color Theme
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              {colorsOption
                .filter((color) => !color.sub)
                .map((color) => (
                  <Box
                    key={color.id}
                    onClick={() => handleColorSelection(color.label)}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: color.color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      outline:
                        selectedColor.label === color.label
                          ? '3px solid #D2D2D2'
                          : 'none',
                      outlineOffset: '3px',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}
                  />
                ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'end', p: 3 }}>
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={handleAddHost}
          color="primary"
          variant="contained"
          disabled={isSaveDisabled}
        >
          생성
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostModal;
