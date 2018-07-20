import * as actionTypes from "./types";

export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
      isAuthenticated: true
    }
  };
};

export const logoutUser = () => {
  return {
    type: actionTypes.LOGOUT_USER,
    payload: {
      currentUser: null,
      isAuthenticated: false
    }
  };
};
