import React from "react";
import mime from "mime-types";
import { Modal } from "semantic-ui-react";

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"]
  };

  addFile = event => {
    const files = event.target.files;
    if (files.length) {
      this.setState({ file: files[0] });
    }
  };

  sendFile = () => {
    const { file } = this.state;

    if (file !== null) {
      if (this.isValid(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        this.props.uploadFile(file, metadata);
        this.props.handleClose();
      }
    }
  };

  isValid = filename => {
    return this.state.authorized.includes(mime.lookup(filename));
  };

  render() {
    const { modalOpen, handleClose } = this.props;

    return (
      <Modal
        className="ui basic modal"
        id="fileModal"
        open={modalOpen}
        onClose={handleClose}
      >
        <i className="close icon" />
        <div className="header">Add a File</div>
        <div className="content">
          <div className="description">
            <div className="ui header">
              Choose a file <strong>(jpg, png, 1mb max)</strong>
            </div>
            <form className="ui form">
              <div className="field">
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={this.addFile}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="actions">
          <div className="ui black deny button">Undo</div>
          <div
            className="ui right green labeled icon button"
            onClick={this.sendFile}
          >
            Send
          </div>
        </div>
      </Modal>
    );
  }
}

export default FileModal;
