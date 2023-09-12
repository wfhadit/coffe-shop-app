import { constant } from "../constant";

const init_state = {
  id: 0,
  role: 0,
  username: "",
  email: "",
  password: "",
  phone: "",
  fullname: "",
  image_url: "",
  gender: "",
};

export const userReducer = (state = init_state, action) => {
  if (action.type === constant.login) {
    return {
      ...state,
      ...action.payload,
    };
  } else if (action.type === constant.logout) return init_state;

  return state;
};
