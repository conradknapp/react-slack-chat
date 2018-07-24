import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentUploaded }) =>
  uploadState ? (
    <Progress
      percent={percentUploaded}
      progress
      indicating
      size="medium"
      inverted
    />
  ) : null;

export default ProgressBar;
