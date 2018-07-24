import React from "react";
import firebase from "../../index";
import uuidv4 from "uuid/v4";
import { connect } from "react-redux";
import { Button, Icon, TextArea, Form } from "semantic-ui-react";

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

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

  openFileModal = () => this.setState({ modalOpen: true });

  closeFileModal = () => this.setState({ modalOpen: false });

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value.trim() });

  createMessage = (fileUrl = null) => {
    const { currentUser } = this.props;
    let message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
        id: currentUser.uid
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { currentChannel, getMessagesRef } = this.props;

    getMessagesRef()
      .child(currentChannel.id)
      .push()
      .set(this.createMessage())
      .then(() => {
        this.setState({ message: "" });
        this.refs.message.ref.value = "";
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: [...this.state.errors, { message: err.message }]
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
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              errors: [...this.state.errors, { message: err.message }],
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: [...this.state.errors, { message: err.message }],
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: [...this.state.errors, { message: err.message }]
        });
      });
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.props.currentChannel.id}`;
    } else {
      return "chat/public";
    }
  };

  render() {
    const { modalOpen, percentUploaded, uploadState } = this.state;

    return (
      <div className="messages__form">
        <Form inverted>
          <TextArea
            ref="message"
            name="message"
            rows={3}
            autoHeight
            onChange={this.handleChange}
            placeholder="Write your message"
          />
          <Button.Group icon>
            <Button icon color="green" onClick={this.sendMessage}>
              Send
            </Button>
            <Button
              icon
              onClick={this.openFileModal}
              disabled={uploadState === "uploading"}
            >
              <Icon name="cloud upload" /> Attach
            </Button>
          </Button.Group>
        </Form>
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
        <FileModal
          modalOpen={modalOpen}
          closeFileModal={this.closeFileModal}
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
