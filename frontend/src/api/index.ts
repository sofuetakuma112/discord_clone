import axios from 'axios';

export default () => {
  return axios.create({
    baseURL: process.env.AXIOS_BASE_URL || 'http://0.0.0.0:5000',
  });
};
