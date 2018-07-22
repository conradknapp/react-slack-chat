import React from "react";
import firebase from "../../index";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

class Users extends React.Component {
  state = {
    users: [],
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence")
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.detachListeners();
  }

  addListeners = () => {
    this.state.usersRef.on("child_added", snap => {
      if (this.props.currentUser.uid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        const users = [...this.state.users, user];
        this.setState({ users });
      }
    });

    this.state.presenceRef.on("child_added", snap => {
      if (this.props.currentUser.uid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", snap => {
      if (this.props.currentUser.uid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });

    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        let ref = this.state.presenceRef.child(this.props.currentUser.uid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsersArray = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        if (connected) {
          user["status"] = "online";
        } else {
          user["status"] = "offline";
        }
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsersArray });
  };

  isUserOnline = user => user.status === "online";

  isChannelActive = user => {
    const channelId = this.getChannelId(user.uid);
    return this.props.currentChannel.id === channelId;
  };

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channel = {
      id: channelId,
      name: user.name
    };

    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(true);
  };

  getChannelId = userId => {
    let currentUserId = this.props.currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  detachListeners = () => {
    this.state.usersRef.off();
    this.state.presenceRef.off();
    this.state.connectedRef.off();
  };

  render() {
    return (
      <div className="users__container">
        <h2 className="ui inverted center aligned header">Users</h2>

        {this.state.users.map(user => (
          <div
            className={`ui feed ${
              this.isChannelActive(user) ? "is_active" : ""
            }`}
            onClick={() => this.changeChannel(user)}
            key={user.uid}
          >
            <div className="event">
              <div className="label">
                <img src={user.avatar} alt="User avatar" />
              </div>
              <div className="content">
                <span
                  className={`ui empty circular label connection__label ${
                    this.isUserOnline(user) ? "green" : "red"
                  }`}
                />
                {user.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.user.currentChannel
});

export default connect(
  mapStateToProps,
  { setCurrentChannel, setPrivateChannel }
)(Users);
