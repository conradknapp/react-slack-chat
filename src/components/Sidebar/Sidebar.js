import React from "react";
import { Header, Divider } from "semantic-ui-react";

import CurrentUser from "./CurrentUser";
import Channels from "./Channels";
import Users from "./Users";

const Sidebar = () => (
  <div className="sidebar">
    <Header as="h1" textAlign="center" inverted>
      Dev Chat
    </Header>
    <CurrentUser />
    <Channels />
    <Divider />
    <Users />
  </div>
);

export default Sidebar;
