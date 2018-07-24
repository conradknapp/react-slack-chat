import React from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Messages from "./components/Messages/Messages";

import { Grid } from "semantic-ui-react";

const App = () => (
  <Grid columns={2}>
    <Grid.Column>
      <Sidebar />
    </Grid.Column>
    <Grid.Column>
      <Messages />
    </Grid.Column>
  </Grid>
);

export default App;
