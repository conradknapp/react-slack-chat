import React from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

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
        this.resetForm();
        this.props.closeFileModal();
      }
    }
  };

  isValid = filename => this.state.authorized.includes(mime.lookup(filename));

  resetForm = () => this.setState({ file: null });

  render() {
    const { modalOpen, closeFileModal } = this.props;

    return (
      <Modal basic open={modalOpen} onClose={closeFileModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
            onChange={this.addFile}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" /> Send
          </Button>
          <Button basic color="red" inverted onClick={this.closeFileModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>

      // <Modal
      //   className="ui basic modal"
      //   id="fileModal"
      //   open={modalOpen}
      //   onClose={handleClose}
      // >
      //   <i className="close icon" />
      //   <div className="header">Add a File</div>
      //   <div className="content">
      //     <div className="description">
      //       <div className="ui header">
      //         Choose a file <strong>(jpg, png, 1mb max)</strong>
      //       </div>
      //       <form className="ui form">
      //         <div className="field">
      //           <input
      //             type="file"
      //             name="file"
      //             id="file"
      //             onChange={this.addFile}
      //           />
      //         </div>
      //       </form>
      //     </div>
      //   </div>
      //   <div className="actions">
      //     <div className="ui black deny button">Undo</div>
      //     <div
      //       className="ui right green labeled icon button"
      //       onClick={this.sendFile}
      //     >
      //       Send
      //     </div>
      //   </div>
      // </Modal>
    );
  }
}

export default FileModal;
