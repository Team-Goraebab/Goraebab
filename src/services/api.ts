import axios from 'axios';

export const getConnectDaemon = async () => {
  const response = await axios.get('/api/remote/daemon');
  return response.data;
};
