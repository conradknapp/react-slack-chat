import React from "react";
import firebase from "../../index";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
        <div className="ui items">
          <div className="item">
            <div className="ui mini image">
              <img src={currentUser.photoURL} alt="User avatar" />
            </div>
            <div className="middle aligned content">
              <div className="ui container">
                <div className="ui inverted header">
                  {currentUser.displayName}
                </div>
              </div>
            </div>
            <div className="extra">
              <button
                className="ui circular icon right floated button"
                onClick={this.logoutUser}
              >
                <i className="icon sign out">.</i>
              </button>
            </div>
          </div>
        </div>
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
