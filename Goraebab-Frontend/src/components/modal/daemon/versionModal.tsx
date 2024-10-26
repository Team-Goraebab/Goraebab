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

interface VersionDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const VersionDetailModal = ({
  open,
  onClose,
  data,
}: VersionDetailModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Docker Version Information</DialogTitle>
      <DialogContent dividers>
        <Box my={2}>
          <div className="text-lg font-bold mb-4">Version Details</div>
          <Box mt={1}>
            <div className="text-sm">
              <strong>Version:</strong> {data?.Version || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>API Version:</strong> {data?.ApiVersion || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Git Commit:</strong> {data?.GitCommit || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Go Version:</strong> {data?.GoVersion || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>OS/Arch:</strong> {data?.Os} / {data?.Arch || 'N/A'}
            </div>
            <div className="text-sm">
              <strong>Build Time:</strong> {data?.BuildTime || 'N/A'}
            </div>
          </Box>
        </Box>

        <Divider />

        <Box my={2}>
          <div className="text-lg font-bold mb-4">Additional Info</div>
          <div className="text-sm">
            <strong>Min API Version:</strong> {data?.MinAPIVersion || 'N/A'}
          </div>
          <div className="text-sm">
            <strong>Kernel Version:</strong> {data?.KernelVersion || 'N/A'}
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button title={'닫기'} onClick={onClose} color="grey" />
      </DialogActions>
    </Dialog>
  );
};

export default VersionDetailModal;
