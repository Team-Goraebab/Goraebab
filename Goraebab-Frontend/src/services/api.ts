import axios from 'axios';

// connect remote daemon
export const getConnectDaemon = async () => {
  const response = await axios.get('/api/remote/daemon');
  return response.data;
};

// search dockerhub image
export const getDockerHubImages = async (query: string) => {
  const response = await axios.get(`/api/dockerHubSearch?query=${query}`);
  return response.data;
};
