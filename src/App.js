import React from "react";
import "./App.css";

import Aside from "./components/Aside/Aside";
import Messages from "./components/Messages/Messages";

import { Sidebar } from "semantic-ui-react";

class App extends React.Component {
  state = {
    visible: false
  };

  toggleAside = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible } = this.state;

    return (
      <React.Fragment>
        <Sidebar.Pushable>
          <Aside visible={visible} />
          <Sidebar.Pusher className="messages__container">
            <Messages toggleAside={this.toggleAside} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </React.Fragment>
    );
  }
}

export default App;
