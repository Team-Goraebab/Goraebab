import { getContainersList } from '@/services/api';
import React, { useState, useEffect } from 'react';

const ContainersManagement = () => {
  const [containersList, setContainersList] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContainersList();
  }, []);

  const fetchContainersList = async () => {
    try {
      const data = await getContainersList();
      setContainersList(data);
    } catch (error) {
      console.error('Error fetching containers list:', error);
      setError('Failed to fetch containers list');
    }
  };

  return (
    <div>
      <h1>Containers Management</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {containersList.map((container: any) => (
          <li key={container.Id}>{container.Names[0]}</li>
        ))}
      </ul>
    </div>
  );
};

export default ContainersManagement;
