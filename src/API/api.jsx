import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:2500",
  baseURL: "http://192.168.35.216:2500",
  headers: { Authorization: `Bearer ${localStorage.getItem("cs-token")}` },
});
