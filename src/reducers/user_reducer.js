import * as actionTypes from "../actions/types";

const initialState = {
  currentUser: null,
  currentChannel: null,
  isAuthenticated: false,
  isPrivateChannel: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isAuthenticated: action.payload.isAuthenticated
      };
    case actionTypes.LOGOUT_USER:
      return { ...initialState };
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    default:
      return state;
  }
};
