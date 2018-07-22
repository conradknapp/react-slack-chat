import React from "react";
import firebase from "../../index";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import Message from "./Message";
import { CSSTransition, TransitionGroup } from "react-transition-group";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    messages: [],
    listeners: [],
    channel: null
  };

  componentWillReceiveProps(nextProps) {
    if (!this.state.current && nextProps.currentChannel.id) {
      this.detachListeners();
      this.setState({ messages: [], channel: nextProps.currentChannel });
      this.addListeners(nextProps.currentChannel.id);
    }
  }

  componentWillUnmount() {
    this.detachListeners();
  }

  addToListeners = (id, ref, event) => {
    const listenerFound =
      this.state.listeners.findIndex(listener => {
        return (
          listener.id === id && listener.ref === ref && listener.event === event
        );
      }) > -1;
    if (!listenerFound) {
      let newListener = { id, ref, event };
      this.setState({ listeners: [...this.state.listeners, newListener] });
    }
  };

  addListeners = channelId => {
    let ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      let newMessages = [snap.val(), ...this.state.messages];
      this.setState({ messages: newMessages });
    });

    this.addToListeners(channelId, ref, "child_added");
  };

  detachListeners = () => {
    this.state.listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
      console.log("off..");
    });

    // if (this.state.channel !== null) {
    //   this.state.messagesRef.child(this.state.channel.id).off("child_added");
    // }
  };

  getMessagesRef = () => {
    if (this.props.isPrivateChannel) {
      return this.state.privateMessagesRef;
    } else {
      return this.state.messagesRef;
    }
  };

  getChannelName = () => {
    if (this.props.currentChannel) {
      const { currentChannel, isPrivateChannel } = this.props;
      return `${isPrivateChannel ? "@" : "#"}${currentChannel.name}`;
    }
  };

  displayMessages = () => {
    return (
      <TransitionGroup>
        {this.state.messages.map(message => (
          <CSSTransition
            key={message.timestamp}
            timeout={500}
            classNames="fade"
          >
            <Message key={message.timestamp} message={message} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="messages__container">
        <div className="messages__content">
          <h2 className="ui inverted center aligned header">
            {this.getChannelName()}
            <div className="ui segment">
              <div className="ui comments">
                {!!messages.length && this.displayMessages()}
              </div>
            </div>
          </h2>
        </div>

        <MessageForm getMessagesRef={this.getMessagesRef} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.user.currentChannel,
  isPrivateChannel: state.user.isPrivateChannel
});

export default connect(mapStateToProps)(Messages);
