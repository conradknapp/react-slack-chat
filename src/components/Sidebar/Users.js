import React from "react";
import firebase from "../../index";
import { Header, Feed, Icon } from "semantic-ui-react";
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
        this.setState({ users: [...this.state.users, user] });
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
        const ref = this.state.presenceRef.child(this.props.currentUser.uid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsersArray = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsersArray });
  };

  isUserOnline = user => user.status === "online";

  isChannelActive = user => {
    if (this.props.currentChannel) {
      const channelId = this.getChannelId(user.uid);
      return this.props.currentChannel.id === channelId;
    }
  };

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
  };

  getChannelId = userId => {
    const currentUserId = this.props.currentUser.uid;
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
    const { users } = this.state;

    return (
      <div className="users__container">
        <Header as="h2" content="Users" textAlign="center" inverted />
        {users.map(user => (
          <Feed key={user.uid}>
            <Feed.Event>
              <Feed.Label image={user.avatar} />
              <Feed.Content onClick={() => this.changeChannel(user)}>
                <Icon
                  name="circle"
                  color={this.isUserOnline(user) ? "green" : "red"}
                />
                {user.name}
              </Feed.Content>
            </Feed.Event>
          </Feed>
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
