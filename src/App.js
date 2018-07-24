import React from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Messages from "./components/Messages/Messages";

const App = () => (
  <div className="chat__container">
    <Sidebar />
    <Messages />
  </div>
);

export default App;
