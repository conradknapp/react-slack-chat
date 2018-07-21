import React, { Component } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Messages from "./components/Messages/Messages";

class App extends Component {
  render() {
    return (
      <div className="chat__container">
        <Sidebar />
        <Messages />
      </div>
    );
  }
}

export default App;
