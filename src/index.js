import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import store from "./store";
import { Provider, connect } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import clientView from "./clientView";
import tripView from "./tripView";
import scheduler from "./scheduler";

class _App extends Component {
  constructor() {
    super();
  }
  async componentDidMount() {
    this.props.load();
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/clients/:id" component={clientView} />
            <Route path="/" component={scheduler} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    load: async () => {
      const clients = (await axios.get("/api/clients")).data;
      const destinations = (await axios.get("/api/destinations")).data;
      const trips = (await axios.get("/api/trips")).data;
      const seven = (await axios.get("/api/nextseven")).data;
      dispatch({
        type: "LOAD_EVERYTHING",
        clients,
        destinations,
        trips,
        seven,
      });
    },
  };
};
const App = connect(mapStateToProps, mapDispatchToProps)(_App);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
