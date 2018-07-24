import React from "react";
import firebase from "../../index";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Header, Button, Icon } from "semantic-ui-react";

import { logoutUser } from "../../actions";

class CurrentUser extends React.Component {
  state = {
    presenceRef: firebase.database().ref("presence")
  };

  logoutUser = () => {
    this.state.presenceRef.child(this.props.currentUser.uid).remove();
    firebase
      .auth()
      .signOut()
      .then(() => console.log("logged out!"));
    this.props.logoutUser();
    this.props.history.push("/login");
  };

  render() {
    const { currentUser } = this.props;

    return (
      <div className="currentUser__container">
        <Header
          floated="left"
          inverted
          as="h2"
          image={currentUser.photoURL}
          content={currentUser.displayName}
        />
        <Button floated="right" circular animated onClick={this.logoutUser}>
          <Button.Content visible>
            <Icon name="sign out" />
          </Button.Content>
          <Button.Content hidden>Logout</Button.Content>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default withRouter(
  connect(
    mapStateToProps,
    { logoutUser }
  )(CurrentUser)
);
