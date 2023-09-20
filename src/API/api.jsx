import axios from 'axios';
// export const API_URL = "http://192.168.35.216:2500";
export const API_URL = 'http://localhost:2500';
export const api = axios.create({
  // baseURL: 'http://localhost:2500',
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem('cs-token')}` },
});
