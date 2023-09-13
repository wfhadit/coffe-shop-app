import { api } from "../../API/api";
import { constant } from "../constant";

export const userLogin = (values) => {
  return async (dispacth) => {
    try {
      const { data } = await api.post(`/users/auth`, values);
      localStorage.setItem("cs-token", data.token);
      dispacth({
        type: constant.login,
        payload: data.user,
      });
      return data.user.role;
    } catch (err) {
      localStorage.removeItem("cs-token");
      return err;
    }
  };
};

export const userLogout = () => {
  return async (dispacth) => {
    localStorage.removeItem("cs-token");
    dispacth({ type: constant.logout });
  };
};
