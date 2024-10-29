'use client';

import { getDockerHubImages } from '@/services/api';
import { useState } from 'react';
import { FaStar, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { formatNumber } from '@/utils/format';
import { Card, CardBody, Input, Button, Spinner, Badge, Divider } from '@nextui-org/react';

interface DockerImage {
  id: string;
  repo_name: string;
  is_official: boolean;
  star_count: number;
  pull_count: number;
  short_description: string;
  tags?: string[];
}

interface DockerHubContentProps {
  onSelectImage: (image: DockerImage) => void;
}

const DockerHubContent = ({ onSelectImage }: DockerHubContentProps) => {
  const [query, setQuery] = useState<string>('');
  const [images, setImages] = useState<DockerImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    const results = await getDockerHubImages(query);
    setImages(results);
    setLoading(false);
  };

  const handleSelectImage = (image: DockerImage) => {
    setSelectedImage(image.repo_name);
    onSelectImage(image);
  };

  return (
    <Card className="w-full" shadow={'none'} style={{ border: '1px solid #F5F5F5' }}>
      <CardBody className="p-6">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="이미지를 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full"
            size="lg"
            radius="sm"
          />
          <Button
            color="primary"
            onClick={handleSearch}
            className="px-6"
            size="lg"
            radius="sm"
          >
            검색
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner label="이미지 검색 중..." color="primary" />
          </div>
        ) : (
          <div className="mt-4 h-48 overflow-y-auto">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={`${image.id}-${image.repo_name}`}>
                  <div
                    className={`py-4 px-2 cursor-pointer transition-all hover:bg-default-100 ${
                      selectedImage === image.repo_name ? 'bg-default-100' : ''
                    }`}
                    onClick={() => handleSelectImage(image)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{image.repo_name}</span>
                        {image.is_official && (
                          <div
                            className="flex flex-row justify-center items-center gap-1 bg-blue_1 px-2 py-1 rounded-lg text-blue_6 text-sm">
                            <FaCheckCircle size={12} />
                            Official
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-warning" />
                          <span className="text-sm">
                            {formatNumber(image.star_count)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaDownload className="text-primary" />
                          <span className="text-sm">
                            {formatNumber(image.pull_count)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-default-500">
                      {image.short_description}
                    </p>
                  </div>
                  {index < images.length - 1 && <Divider />}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-default-500 text-center">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default DockerHubContent;
