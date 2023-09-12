import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const nav = useNavigate();
  useEffect(() => {
    nav("/login");
  }, []);
  return <h1>Welcome</h1>;
};
