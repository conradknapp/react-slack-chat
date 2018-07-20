import * as actionTypes from "../actions/types";

const initialState = {
  currentUser: null,
  isAuthenticated: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isAuthenticated: action.payload.isAuthenticated
      };
    default:
      return state;
  }
};
