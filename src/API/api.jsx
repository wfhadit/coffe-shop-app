import axios from "axios";
export const API_URL = "http://the-coffee-space-api.crystalux.site";
// export const API_URL = "http://localhost:2500";
export const api = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("cs-token")}` },
});
