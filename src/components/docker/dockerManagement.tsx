import { getDockerList, connectDocker, deleteDocker } from '@/services/api';
import React, { useState, useEffect } from 'react';

const DockerManagement = () => {
  const [dockerList, setDockerList] = useState([]);

  useEffect(() => {
    fetchDockerList();
  }, []);

  const fetchDockerList = async () => {
    const data = await getDockerList();
    setDockerList(data);
  };

  const handleConnectDocker = async () => {
    await connectDocker();
    fetchDockerList();
  };

  const handleDeleteDocker = async (dockerId: string) => {
    await deleteDocker(dockerId);
    fetchDockerList();
  };

  return (
    <div>
      <h1>Docker Management</h1>
      <button onClick={handleConnectDocker}>Connect Docker</button>
      <ul>
        {dockerList.map((docker: any) => (
          <li key={docker.id}>
            {docker.name}
            <button onClick={() => handleDeleteDocker(docker.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DockerManagement;
