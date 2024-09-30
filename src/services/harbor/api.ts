import axios from 'axios';
import { BASE_URL, REMOTE_HARBORS } from '@/app/api/urlPath';

export const getRemoteHarbors = async () => {
  const response = await axios.get(`${BASE_URL}${REMOTE_HARBORS}`, {
    params: {},
  });
  return response.data;
};
