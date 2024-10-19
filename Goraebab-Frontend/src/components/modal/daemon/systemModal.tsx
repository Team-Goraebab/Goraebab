'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider,
} from '@mui/material';
import { Button } from '@/components';

interface SystemInfoModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const SystemInfoModal = ({ open, onClose, data }: SystemInfoModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Docker System Information</DialogTitle>
      <DialogContent dividers>
        <Box my={2}>
          <div className="text-lg font-bold">System Details</div>
          <Box mt={1}>
            <div className="text-sm">
              <strong>Operating System:</strong>{' '}
              {data?.OperatingSystem || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Architecture:</strong> {data?.Architecture || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>CPUs:</strong> {data?.NCPU || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Total Memory:</strong> {data?.MemTotal || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Docker Root Directory:</strong>{' '}
              {data?.DockerRootDir || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Logging Driver:</strong> {data?.LoggingDriver || 'N/A'}
            </div>
          </Box>
        </Box>

        <Divider />

        <Box my={2}>
          <div className="text-lg font-bold">Registry Info</div>
          <div className="text-sm">
            <strong>Registry URL:</strong> {data?.IndexServerAddress || 'N/A'}
          </div>
          <div className="text-sm break-all">
            <strong>Registry Config:</strong>{' '}
            {JSON.stringify(data?.RegistryConfig, null, 2)}
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button title={'닫기'} onClick={onClose} color="grey" />
      </DialogActions>
    </Dialog>
  );
};

export default SystemInfoModal;
