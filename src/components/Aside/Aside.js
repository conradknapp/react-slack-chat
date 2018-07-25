import React from "react";
import { Header, Sidebar, Menu } from "semantic-ui-react";

import CurrentUser from "./CurrentUser";
import Channels from "./Channels";
import Users from "./Users";

const Aside = ({ visible }) => (
  <Sidebar
    inverted
    vertical
    animation="push"
    direction="left"
    visible={visible}
    as={Menu}
    className="aside"
  >
    <Menu.Item>
      <CurrentUser />
    </Menu.Item>
    <Menu.Item>
      <Header as="h1" textAlign="center" inverted content="DevChat" />
    </Menu.Item>
    <Menu.Item>
      <Channels />
    </Menu.Item>
    <Menu.Item>
      <Users />
    </Menu.Item>
  </Sidebar>
);

export default Aside;
