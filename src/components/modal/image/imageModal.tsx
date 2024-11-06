'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Input,
  Card,
  CardBody,
  type Selection,
} from '@nextui-org/react';
import {
  FolderIcon,
  TagIcon,
  FileTextIcon,
  TrashIcon,
  DockIcon,
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import { showSnackbar } from '@/utils/toastUtils';
import { DockerHubContent } from '@/components';
import { Key } from '@react-types/shared';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    name: string,
    tag: string,
    file: File | null,
    size: string,
    source: 'local' | 'dockerHub',
    dockerImageInfo?: any
  ) => void;
}

type TabKey = 'dockerHub' | 'local';

const ImageModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('dockerHub');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [dockerImageInfo, setDockerImageInfo] = useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setName('');
      setTag('');
      setSize('');
      setActiveTab('dockerHub');
      setDockerImageInfo(null);
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (file: File | null) => {
    if (file) {
      const validExtensions = ['.tar', '.tar.gz', '.tar.bz2', '.tar.xz'];
      const isValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isValidExtension) {
        showSnackbar(
          enqueueSnackbar,
          'tar, tar.gz, tar.bz2, tar.xz 파일만 업로드 가능합니다.',
          'error',
          '#FF4853'
        );
        return;
      }

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (parseFloat(fileSizeMB) > 5000) {
        showSnackbar(
          enqueueSnackbar,
          '파일 용량이 5000MB를 초과했습니다.',
          'error',
          '#FF4853'
        );
      } else {
        setFile(file);
        setSize(fileSizeMB);
      }
    } else {
      setFile(null);
      setSize('');
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setSize('');
  };

  const validateInputs = () => {
    if (!file && activeTab === 'local') {
      showSnackbar(
        enqueueSnackbar,
        '이미지를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return false;
    }
    if (!name) {
      showSnackbar(enqueueSnackbar, '이름을 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    if (!tag) {
      showSnackbar(enqueueSnackbar, '태그를 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    if (activeTab === 'dockerHub' && !dockerImageInfo) {
      showSnackbar(
        enqueueSnackbar,
        'Docker Hub 이미지를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateInputs()) {
      const id = uuidv4();
      if (activeTab === 'local' && file) {
        onSave(id, name, tag, file, size, 'local');
      } else if (activeTab === 'dockerHub' && dockerImageInfo) {
        onSave(id, name, tag, null, size, 'dockerHub', dockerImageInfo);
      }
      onClose();
    }
  };

  const handleTabChange = (key: Key) => {
    const selectedKey = key as TabKey;
    if (file && selectedKey === 'dockerHub') {
      setIsWarningModalOpen(true);
    } else {
      setActiveTab(selectedKey);
    }
  };

  const handleWarningConfirm = () => {
    setFile(null);
    setSize('');
    setActiveTab('dockerHub');
    setIsWarningModalOpen(false);
  };

  const handleDockerHubImageSelect = (image: any) => {
    setDockerImageInfo(image);
    setName(image.repo_name);
    setTag(image.tags?.[0] || 'latest');
  };

  const renderFileUpload = () => {
    if (file) {
      return (
        <Card className="w-full mt-4">
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-primary font-medium">{file.name}</p>
              <p className="text-sm text-default-500">{size} MB</p>
            </div>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={handleDeleteFile}
              className="min-w-unit-10"
            >
              <TrashIcon size={20} />
            </Button>
          </CardBody>
        </Card>
      );
    }

    return (
      <label className="flex flex-col items-center justify-center w-full h-[200px] mt-4 border-2 border-dashed rounded-large border-primary cursor-pointer hover:bg-default-100 transition-colors">
        <FolderIcon size={48} className="text-primary mb-4" />
        <p className="text-default-700">
          파일을 드래그하거나 클릭하여 선택하세요
        </p>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".tar,.tar.gz,.tar.bz2,.tar.xz"
        />
      </label>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={handleTabChange}
                  color="primary"
                  variant="underlined"
                  classNames={{
                    tabList: 'gap-6',
                  }}
                >
                  <Tab
                    key="dockerHub"
                    title={
                      <div className="flex items-center space-x-2">
                        <DockIcon size={20} />
                        <span>Docker Hub</span>
                      </div>
                    }
                  />
                  <Tab
                    key="local"
                    title={
                      <div className="flex items-center space-x-2">
                        <FolderIcon size={20} />
                        <span>Local Path</span>
                      </div>
                    }
                  />
                </Tabs>
              </ModalHeader>
              <ModalBody>
                {activeTab === 'dockerHub' ? (
                  <DockerHubContent
                    onSelectImage={handleDockerHubImageSelect}
                  />
                ) : (
                  renderFileUpload()
                )}
                <div className="space-y-4 mt-4">
                  <Input
                    label="이름"
                    value={name}
                    onValueChange={setName}
                    startContent={
                      <FileTextIcon size={18} className="text-default-400" />
                    }
                    variant="bordered"
                  />
                  <Input
                    label="태그"
                    value={tag}
                    onValueChange={setTag}
                    startContent={
                      <TagIcon size={18} className="text-default-400" />
                    }
                    variant="bordered"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  취소
                </Button>
                <Button color="primary" onPress={handleSave}>
                  저장하기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>경고</ModalHeader>
              <ModalBody>
                <p>
                  로컬 파일이 이미 존재합니다. Docker Hub로 전환하면 현재 선택된
                  파일이 삭제됩니다. 계속하시겠습니까?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  취소
                </Button>
                <Button color="primary" onPress={handleWarningConfirm}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageModal;
