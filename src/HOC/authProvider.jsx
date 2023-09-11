import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../API/api";
import { constant } from "../redux/constant";

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      //post token untuk dapat token baru (keep login)
      await api.post("/users/token").then((result) => {
        dispatch({ type: constant.login, payload: result.data.user });
        localStorage.setItem("cs-token", result.data.token);
      });
    } catch (err) {
      localStorage.removeItem("cs-token");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userSelector.id) setIsLoading(false);
  }, [userSelector]);

  return isLoading ? <Spinner /> : children;
};
