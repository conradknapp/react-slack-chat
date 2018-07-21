import React from "react";
import firebase from "../../index";
import { connect } from "react-redux";
import { Modal, Message } from "semantic-ui-react";

import { setCurrentChannel } from "../../actions";

class Channels extends React.Component {
  state = {
    channels: [],
    newChannel: "",
    errors: [],
    modalOpen: false,
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.detachListeners();
  }

  addListeners = () => {
    this.state.channelsRef.on("child_added", snap => {
      this.setState({
        channels: this.state.channels.concat([
          { id: snap.val().id, name: snap.val().name }
        ])
      });

      if (this.state.firstLoad && this.state.channels.length > 0) {
        this.props.setCurrentChannel(this.state.channels[0]);
      } else {
        this.setState({ firstLoad: false });
      }
    });
  };

  detachListeners = () => {
    this.state.channelsRef.off();
  };

  addChannel = () => {
    let key = this.state.channelsRef.push().key;
    let newChannel = { id: key, name: this.state.newChannel };
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
          errors: this.state.errors.concat([
            { type: err.name, message: err.message }
          ])
        });
      });
  };

  setActiveChannel = channel => {
    if (this.props.currentChannel) {
      return channel.id === this.props.currentChannel.id;
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  openChannelModal = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => this.setState({ modalOpen: false });

  changeChannel = channel => {
    this.props.setCurrentChannel(channel);
  };

  displayChannels = () =>
    this.state.channels.map((channel, i) => (
      <li
        key={i}
        onClick={() => this.changeChannel(channel)}
        className={`channels__item ${
          this.setActiveChannel(channel) ? "is_active" : ""
        }`}
      >
        {channel.name}
      </li>
    ));

  displayErrors = () =>
    this.state.errors.map((error, i) => <p key={i}>{error.message}</p>);

  render() {
    const { modalOpen, errors, channels } = this.state;

    return (
      <div className="channels__container">
        <h2 className="ui inverted center aligned header">
          Channels{" "}
          <i
            className="add square icon add_channel"
            onClick={this.openChannelModal}
          />
        </h2>
        <div className="ui raised padded segment channels__list">
          <ul>{!!channels.length && this.displayChannels()}</ul>
        </div>

        <Modal
          className="ui basic modal"
          id="channelModal"
          open={modalOpen}
          onClose={this.handleClose}
        >
          <div className="ui icon header">Add a channel</div>

          <div className="content">
            <div className="ui inverted form">
              <div className="field">
                <label htmlFor="new_channel">Name of Channel</label>
                <input
                  type="text"
                  name="newChannel"
                  onChange={this.handleChange}
                  id="new_channel"
                />
              </div>
              {!!errors.length && (
                <Message inverted color="red">
                  <h3>Error</h3>
                  {this.displayErrors()}
                </Message>
              )}
            </div>
          </div>

          <div className="actions">
            <div className="ui red basic cancel inverted button">
              <i className="remove icon" onClick={this.handleClose} />Remove
            </div>
            <div
              className="ui green cancel inverted button"
              onClick={this.addChannel}
            >
              <i className="checkmark icon" />Add
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.user.currentChannel
});

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(Channels);
