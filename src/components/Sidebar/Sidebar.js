import React from "react";
import { Header } from "semantic-ui-react";

import CurrentUser from "./CurrentUser";
import Channels from "./Channels";
import Users from './Users';

class Sidebar extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <Header as="h1" textAlign="center" inverted>
          Slack Clone
        </Header>
        <CurrentUser />
        <Channels />
        <div className="ui divider"></div>
        <Users />
      </div>
    );
  }
}

export default Sidebar;
