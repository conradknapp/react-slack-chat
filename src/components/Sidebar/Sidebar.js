import React from "react";
import { Header } from "semantic-ui-react";

import CurrentUser from "./CurrentUser";

class Sidebar extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <Header as="h1" textAlign="center" inverted>
          Slack Clone
        </Header>
        <CurrentUser />
      </div>
    );
  }
}

export default Sidebar;
