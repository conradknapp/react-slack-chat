import * as actionTypes from "../actions/types";

const initialState = {
  currentUser: null,
  currentChannel: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};
