import {
  getDBList,
  registerDB,
  copyDBDesignToLocal,
  deleteDB,
} from '@/services/api';
import React, { useState, useEffect } from 'react';

const DBManagement = () => {
  const [dbList, setDbList] = useState([]);
  const [newDB, setNewDB] = useState({ name: '', user: '', password: '' });

  useEffect(() => {
    fetchDBList();
  }, []);

  const fetchDBList = async () => {
    const data = await getDBList();
    setDbList(data);
  };

  const handleRegisterDB = async () => {
    await registerDB(newDB);
    fetchDBList();
  };

  const handleCopyDBDesignToLocal = async () => {
    await copyDBDesignToLocal();
    fetchDBList();
  };

  const handleDeleteDB = async (dbId: string) => {
    await deleteDB(dbId);
    fetchDBList();
  };

  return (
    <div>
      <h1>DB Management</h1>
      <input
        type="text"
        placeholder="Name"
        value={newDB.name}
        onChange={(e) => setNewDB({ ...newDB, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="User"
        value={newDB.user}
        onChange={(e) => setNewDB({ ...newDB, user: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={newDB.password}
        onChange={(e) => setNewDB({ ...newDB, password: e.target.value })}
      />
      <button onClick={handleRegisterDB}>Register DB</button>
      <button onClick={handleCopyDBDesignToLocal}>
        Copy DB Design to Local
      </button>
      <ul>
        {dbList.map((db: any) => (
          <li key={db.id}>
            {db.name}
            <button onClick={() => handleDeleteDB(db.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DBManagement;
