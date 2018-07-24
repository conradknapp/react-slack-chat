import React from "react";
import moment from "moment";
import { connect } from "react-redux";

class Message extends React.Component {
  state = {
    image: false
  };

  componentDidMount() {
    this.isImage(this.props.message);
  }

  isImage = message => {
    const image =
      message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    this.setState({ image });
  };

  isOwnMessage = user => user.id === this.props.currentUser.uid;

  fromNow = time => moment(time).fromNow();

  render() {
    const { message } = this.props;
    const { image } = this.state;

    return (
      <div className="comment comment__container">
        <a className="avatar">
          <img src={message.user.avatar} alt="User avatar" />
        </a>
        <div
          className={`content ${
            this.isOwnMessage(message.user) ? "comment__self" : ""
          }`}
        >
          <a className="author">{message.user.name}</a>
          <div className="metadata">
            <span className="date comment__date">
              {this.fromNow(message.timestamp)}
            </span>
          </div>
          {image ? (
            <img
              className="ui image comment__image"
              src={message.image}
              alt={`Uploaded by user ${message.user.name}`}
            />
          ) : (
            <div className="text">{message.content}</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(Message);
