import React from "react";
import { connect } from "react-redux";

const views = () => {
  return <h1>Goodbye</h1>;
};
const tripView = connect()(views);
export default tripView;
