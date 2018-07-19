import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import firebase from "firebase/app";
import "firebase/auth";

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

const Root = () => (
  <Router>
    <React.Fragment>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </React.Fragment>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
