import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "semantic-ui-css/semantic.min.css";

import root_reducer from "./reducers";

let config = {
  apiKey: "AIzaSyD4S9Zy7fVxMZx-R9UT0_rvikQi-ogF0NA",
  authDomain: "react-firebase-slack-chat.firebaseapp.com",
  databaseURL: "https://react-firebase-slack-chat.firebaseio.com",
  projectId: "react-firebase-slack-chat",
  storageBucket: "react-firebase-slack-chat.appspot.com",
  messagingSenderId: "395917321922"
};
firebase.initializeApp(config);
export default firebase;

const store = createStore(
  root_reducer,
  composeWithDevTools(applyMiddleware(ReduxPromise))
);

const Root = () => (
  <Router>
    <React.Fragment>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </React.Fragment>
  </Router>
);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById("root")
);
