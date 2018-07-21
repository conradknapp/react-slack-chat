import React from "react";
import firebase from "../../index";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import Message from "./Message";
import { CSSTransition, TransitionGroup } from "react-transition-group";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    channel: null
  };

  componentWillReceiveProps(nextProps) {
    if (!this.state.current && nextProps.currentChannel.id) {
      this.detachListeners();
      this.setState({ messages: [], channel: nextProps.currentChannel });
      this.addListeners(nextProps.currentChannel.id);
    }
  }

  // componentWillUnmount() {
  //   this.detachListeners();
  // }

  addListeners = channelId => {
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      let newMessages = [snap.val(), ...this.state.messages];
      this.setState({ messages: newMessages });
    });
  };

  detachListeners = () => {
    if (this.state.channel !== null) {
      this.state.messagesRef.child(this.state.channel.id).off("child_added");
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
    const { messages, messagesRef } = this.state;

    return (
      <div className="messages__container">
        <div className="messages__content">
          <h2 className="ui inverted center aligned header">
            Name of Channel
            <div className="ui segment">
              <div className="ui comments">
                {!!messages.length && this.displayMessages()}
              </div>
            </div>
          </h2>
        </div>

        <MessageForm messagesRef={messagesRef} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.user.currentChannel
});

export default connect(mapStateToProps)(Messages);
