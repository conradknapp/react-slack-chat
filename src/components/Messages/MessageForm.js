import React from "react";
import firebase from "../../index";
import { connect } from "react-redux";

class MessageForm extends React.Component {
  state = {
    message: "",
    errors: []
  };

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value.trim() });

  createMessage = () => {
    const { currentUser } = this.props;

    return {
      content: this.state.message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
        id: currentUser.uid
      }
    };
  };

  sendMessage = () => {
    const { currentChannel, messagesRef } = this.props;
    console.log("sending message...");
    messagesRef
      .child(currentChannel.id)
      .push()
      .set(this.createMessage())
      .then(() => {
        console.log("message sent!");
        this.setState({ message: "" });
        this.refs.message.value = "";
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat([
            { type: err.name, message: err.message }
          ])
        });
      });
  };

  render() {
    return (
      <div className="messages__form">
        <div className="ui inverted form">
          <div className="two fields">
            <div className="field">
              <textarea
                ref="message"
                name="message"
                id="message"
                rows="3"
                placeholder="Write your message"
                onChange={this.handleChange}
              />
            </div>

            <div className="field">
              <button className="ui green button" onClick={this.sendMessage}>
                Send
              </button>
              <button className="ui labeled icon button">
                <i className="cloud upload icon" /> Attach
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.user.currentChannel
});

export default connect(mapStateToProps)(MessageForm);
