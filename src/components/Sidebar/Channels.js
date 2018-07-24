import React from "react";
import firebase from "../../index";
import { connect } from "react-redux";
// prettier-ignore
import { Header, Modal, Message, Button, Icon, Input, Container, Menu } from "semantic-ui-react";

import { setCurrentChannel, setPrivateChannel } from "../../actions";

class Channels extends React.Component {
  state = {
    channels: [],
    newChannel: "",
    errors: [],
    modalOpen: false,
    channelsRef: firebase.database().ref("channels"),
    messagesRef: firebase.database().ref("messages"),
    firstLoad: true,
    notificationCount: []
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.detachListeners();
  }

  addListeners = () => {
    this.state.channelsRef.on("child_added", snap => {
      this.addCountListener(snap.key);
      this.setState({ channels: [...this.state.channels, snap.val()] });
      if (this.state.firstLoad && !!this.state.channels.length) {
        this.props.setCurrentChannel(this.state.channels[0]);
      }
      this.setState({ firstLoad: false });
    });
  };

  addCountListener = channelId => {
    console.log(channelId);
    // this.state.messagesRef.child(channelId).on("value", snap => {
    //   // prettier-ignore
    //   console.log(snap);
    //   this.handleNotifications(channelId, this.props.currentChannel.id, this.state.notificationCount, snap);
    // });
  };

  // prettier-ignore
  // handleNotifications = (channelId, currentChannelId, notificationCount, snap) => {
  //   let lastTotal = 0;
  //   const index = notificationCount.findIndex(el => el.id === channelId) > -1;
  //   if (index) {
  //     if (channelId !== currentChannelId) {
  //       lastTotal = notificationCount[index].total;
  //       if (snap.numChildren - lastTotal > 0) {
  //         notificationCount[index].notif = snap.numChildren() - lastTotal;
  //       }
  //     }
  //   } else {
  //     const newNotification = {
  //       id: channelId,
  //       total: snap.numChildren(),
  //       lastKnownTotal: snap.numChildren(),
  //       notif: 0
  //     };
  //     this.setState({
  //       notificationCount: [...this.state.notificationCount, newNotification]
  //     });
  //   }
  // };

  detachListeners = () => this.state.channelsRef.off();

  addChannel = () => {
    const key = this.state.channelsRef.push().key;
    const newChannel = { id: key, name: this.state.newChannel };
    this.state.channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ newChannel: "" });
        this.handleClose();
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: [...this.state.errors, { message: err.message }]
        });
      });
  };

  setActiveChannel = channel =>
    this.props.currentChannel && channel.id === this.props.currentChannel.id;

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value.trim() });

  openChannelModal = () => this.setState({ modalOpen: true });

  closeChannelModal = () => this.setState({ modalOpen: false });

  changeChannel = channel => {
    this.props.setPrivateChannel(false);
    this.props.setCurrentChannel(channel);
  };

  displayChannels = channels =>
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        //className={this.setActiveChannel(channel) ? "active" : ""}
      >
        {channel.name}
      </Menu.Item>
    ));

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  render() {
    const { modalOpen, errors, channels } = this.state;

    return (
      <Container>
        <Header as="h2" textAlign="center" inverted>
          Channels
          <Icon
            name="plus square outline"
            color="teal"
            onClick={this.openChannelModal}
          />
        </Header>
        <Menu vertical secondary>
          {channels.length > 0 && this.displayChannels(channels)}
        </Menu>
        <Modal basic open={modalOpen} onClose={this.closeChannelModal}>
          <Modal.Header>Add a channel</Modal.Header>
          <Modal.Content>
            <Input
              fluid
              label="Name of Channel"
              name="newChannel"
              onChange={this.handleChange}
            />
            {errors.length > 0 && (
              <Message inverted color="red">
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.addChannel}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button basic color="red" inverted onClick={this.closeChannelModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.channel.currentChannel
});

export default connect(
  mapStateToProps,
  { setCurrentChannel, setPrivateChannel }
)(Channels);
