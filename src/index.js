import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import root_reducer from "./reducers";
import { setUser } from "./actions";
import { Dimmer, Loader, Transition } from "semantic-ui-react";
// import { CSSTransition } from "react-transition-group";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import "semantic-ui-css/semantic.min.css";

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

const store = createStore(root_reducer, composeWithDevTools());

class WithAuthorization extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
      } else {
        this.props.setUser(null, false);
      }
    });
  }

  render() {
    const { isAuthenticated, isLoading } = this.props;
    return !isLoading ? (
      <React.Fragment>{this.props.render({ isAuthenticated })}</React.Fragment>
    ) : (
      <Transition.Group animation="scale" duration={500}>
        <Dimmer active>
          <Loader size="big" />
        </Dimmer>
      </Transition.Group>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  isLoading: state.user.isLoading
});

WithAuthorization = connect(
  mapStateToProps,
  { setUser }
)(WithAuthorization);

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Root = () => (
  <WithAuthorization
    render={({ isAuthenticated }) => (
      <Router>
        <React.Fragment>
          <PrivateRoute
            exact
            path="/"
            component={App}
            isAuthenticated={isAuthenticated}
          />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </React.Fragment>
      </Router>
    )}
  />
);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById("root")
);
