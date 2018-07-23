import React from "react";
import firebase from "../../index";
import uuidv4 from "uuid/v4";
import { connect } from "react-redux";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

class MessageForm extends React.Component {
  state = {
    message: "",
    errors: [],
    modalOpen: false,
    uploadTask: null,
    uploadState: null,
    percentUploaded: 0,
    storageRef: firebase.storage().ref()
  };

  openChannelModal = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => this.setState({ modalOpen: false });

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
    const { currentChannel, getMessagesRef } = this.props;
    console.log("sending message...");
    getMessagesRef()
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

  uploadFile = (file, metadata) => {
    if (file === null) return false;

    const pathToUpload = this.props.currentChannel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded =
              Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
          },
          () => {}
        );
      }
    );
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.props.currentChannel.id}`;
    } else {
      return "chat/public";
    }
  };

  render() {
    const { modalOpen, percentUploaded } = this.state;

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
              <button
                className="ui labeled icon button"
                onClick={this.openChannelModal}
              >
                <i className="cloud upload icon" /> Attach
              </button>
            </div>
          </div>
        </div>
        <ProgressBar percentUploaded={percentUploaded} />
        <FileModal
          modalOpen={modalOpen}
          handleClose={this.handleClose}
          uploadFile={this.uploadFile}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.user.currentChannel,
  isPrivateChannel: state.user.isPrivateChannel
});

export default connect(mapStateToProps)(MessageForm);
