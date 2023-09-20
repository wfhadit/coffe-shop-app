import axios from "axios";
// export const API_URL = "http://192.168.207.2:2500";
export const API_URL = "http://localhost:2500";
export const api = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem('cs-token')}` },
});
