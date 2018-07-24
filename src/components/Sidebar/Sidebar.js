import React from "react";
import { Header, Divider, Sidebar as Aside, Menu } from "semantic-ui-react";

import CurrentUser from "./CurrentUser";
import Channels from "./Channels";
import Users from "./Users";

const Sidebar = () => (
  <Aside inverted vertical visible as={Menu}>
    <Header as="h1" textAlign="center" inverted content="DevChat" />
    <CurrentUser />
    <Channels />
    <Divider />
    <Users />
  </Aside>
);

export default Sidebar;
