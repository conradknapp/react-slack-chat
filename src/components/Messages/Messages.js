import React from "react";
import firebase from "../../index";
import { connect } from "react-redux";
// prettier-ignore
import { Message as Mess, Icon, Header, Segment, Comment, Container, Transition, List } from "semantic-ui-react";

import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    messages: [],
    listeners: [],
    channel: null,
    loading: false
  };

  static getDerivedStateFromProps(props, state) {
    // prettier-ignore
    if (state.channel === null || props.currentChannel.id !== state.channel.id) {
      return {
        messages: [],
        channel: props.currentChannel
      };
    }
     else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { channel, listeners } = this.state;
    // prettier-ignore
    if ((channel.id && !prevState.channel) || (channel.id !== prevState.channel.id)) {
      this.detachListeners(listeners);
      this.addListeners(channel.id);
    }
  }

  componentWillUnmount() {
    this.detachListeners(this.state.listeners);
  }

  addListeners = channelId => {
    this.setState({ loading: true });
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      this.setState({
        messages: [snap.val(), ...this.state.messages],
        loading: false
      });
    });

    this.addToListeners(channelId, ref, "child_added");
  };

  addToListeners = (id, ref, event) => {
    const listenerFound =
      this.state.listeners.findIndex(listener => {
        return (
          listener.id === id && listener.ref === ref && listener.event === event
        );
      }) > -1;
    if (!listenerFound) {
      const newListener = { id, ref, event };
      this.setState({ listeners: [...this.state.listeners, newListener] });
    }
  };

  detachListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });

    // if (this.state.channel !== null) {
    //   this.state.messagesRef.child(this.state.channel.id).off("child_added");
    // }
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef } = this.state;
    return this.props.isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  getChannelName = channel =>
    `${this.props.isPrivateChannel ? "@" : "#"}${channel.name}`;

  displayMessages = messages => (
    <Transition.Group
      as={List}
      duration={1200}
      divided
      verticalAlign="middle"
    >
      {messages.map(message => (
        <Message key={message.timestamp} message={message} />
      ))}
    </Transition.Group>
  );

  ifNoMessages = () => (
    <Mess warning>
      <Mess.Header>No Messages Currently</Mess.Header>
      <Icon name="frown" />
      <p>Be the first to add one!</p>
    </Mess>
  );

  render() {
    const { channel, messages, loading } = this.state;

    return (
      <Container>
        <Header as="h2" textAlign="center">
          {channel && this.getChannelName(channel)}
        </Header>
        <Segment loading={loading}>
          {messages.length === 0 && this.ifNoMessages()}
          <Comment.Group>
            {messages.length > 0 && this.displayMessages(messages)}
            <MessageForm getMessagesRef={this.getMessagesRef} />
          </Comment.Group>
        </Segment>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
});

export default connect(mapStateToProps)(Messages);
