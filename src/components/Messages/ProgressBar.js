import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ percentUploaded }) => (
  <Progress percent={percentUploaded} progress indicating small inverted />
);

export default ProgressBar;
