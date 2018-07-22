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

export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  };
};

export const setPrivateChannel = isPrivateChannel => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel
    }
  };
};
