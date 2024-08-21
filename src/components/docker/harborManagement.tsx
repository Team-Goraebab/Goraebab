import { getHarborList, registerHarbor } from '@/services/api';
import React, { useState, useEffect } from 'react';

const HarborManagement = () => {
  const [harborList, setHarborList] = useState([]);
  const [newHarbor, setNewHarbor] = useState({ name: '', location: '' });

  useEffect(() => {
    fetchHarborList();
  }, []);

  const fetchHarborList = async () => {
    const data = await getHarborList();
    setHarborList(data);
  };

  const handleRegisterHarbor = async () => {
    await registerHarbor(newHarbor);
    fetchHarborList();
  };

  return (
    <div>
      <h1>Harbor Management</h1>
      <input
        type="text"
        placeholder="Name"
        value={newHarbor.name}
        onChange={(e) => setNewHarbor({ ...newHarbor, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={newHarbor.location}
        onChange={(e) =>
          setNewHarbor({ ...newHarbor, location: e.target.value })
        }
      />
      <button onClick={handleRegisterHarbor}>Register Harbor</button>
      <ul>
        {harborList.map((harbor: any) => (
          <li key={harbor.id}>{harbor.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HarborManagement;
