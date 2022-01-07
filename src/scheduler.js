import React, { Component } from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

class scheduler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientName: "",
      clientId: 1,
      destinationName: "",
      date: "",
      purpose: "",
    };
  }
  change = (event) => {
    this.setState({ destinationName: event.target.value });
  };

  changeClient = (event) => {
    this.setState({ clientName: event.target.value });
  };

  changeDate = (event) => {
    this.setState({ date: event.target.value });
  };

  changePurpose = (event) => {
    this.setState({ purpose: event.target.value });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const trip = (await axios.post(`/api/trips`, this.state)).data;
      this.props.newTrip(trip);
    } catch (ex) {
      console.log(ex);
    }
  };

  delay = async (id) => {
    try {
      const delayed = (await axios.put(`/api/trips/delay/${id}`)).data;
    } catch (ex) {
      console.log(ex);
    }
  };

  dateCreator = (days, d = new Date()) => {
    d.setTime(d.getTime() + 86400000 * days);
    return d.toISOString().slice(0, 10);
  };
  render() {
    const { trips, clients, destinations } = this.props;
    const dateToday = new Date().toISOString().slice(0, 10);
    const sevenDays = this.dateCreator(7);
    const flatCurrent = new Date(this.dateCreator(0)).getTime();
    console.log("flatcurrent", flatCurrent);
    const seven = trips.filter((e) => {
      let m = new Date(e.date).getTime();
      console.log("element", m);
      return flatCurrent <= m <= new Date(sevenDays).getTime();
    });
    return (
      <div>
        <h1>
          Acme Travel Agency
          <br /> Total Trips: ({trips.length})
        </h1>
        <button
          id="clientButton"
          onClick={() =>
            this.props.history.push(`/clients/${this.state.clientName}`)
          }
        >
          View/Edit Client's Trips
        </button>
        <ul>
          <li>
            To view trips for a specific client, please select the client below
            then click on 'View/Edit Client's Trips' (above)
          </li>
          <li>
            To add a trip, please select the appropriate choices below then
            click on 'Submit Trip' (below)
          </li>
        </ul>

        <form id="scheduler" onSubmit={this.handleSubmit}>
          <label>Clients*</label>
          <select
            name="client"
            onChange={this.changeClient}
            value={this.state.clientName}
          >
            <option value="">----------------------------</option>
            {clients.map((e) => {
              return (
                <option value={e.id} key={e.id}>
                  {e.name}
                </option>
              );
            })}
          </select>
          <label>Destinations*</label>
          <select
            name="destination"
            onChange={this.change}
            value={this.state.destinationName}
          >
            <option value="">----------------------------</option>
            {destinations.map((e) => {
              return (
                <option value={e.id} key={e.id}>
                  {e.name}
                </option>
              );
            })}
          </select>
          <label>Purpose*</label>
          <select
            name="purpose"
            onChange={this.changePurpose}
            value={this.state.purpose}
          >
            <option value="">----------------------------</option>
            <option value="business">Business</option>
            <option value="pleasure">Pleasure</option>
            <option value="other">Other</option>
          </select>

          <label>Start date*</label>

          <input
            type="date"
            id="start"
            name="trip-start"
            min={dateToday}
            max="2025-12-31"
            onChange={(event) => this.setState({ date: event.target.value })}
          />
          <p id="notice">*Denotes required field</p>
          <br />

          <button
            type="submit"
            disabled={
              this.state.clientName === "" ||
              this.state.destinationName === "" ||
              this.state.date === "" ||
              this.state.purpose === ""
            }
          >
            Submit Trip
          </button>
        </form>

        <h2>Trips scheduled for the next seven days:</h2>

        <table>
          <tbody>
            <tr id="topRow">
              <td>NAME</td>
              <td>DESTINATION</td>
              <td>DATE</td>
              <td>PURPOSE</td>
              <td>PUSH BACK?</td>
            </tr>
            {seven
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((e) => {
                return (
                  <tr key={e.id}>
                    <td>{e.client.name}</td>
                    <td>{e.destination.name}</td>
                    <td>{e.date}</td>
                    <td>{e.purpose}</td>
                    <td>
                      <button onClick={() => this.delay(e.id)}>
                        Delay by 1 day
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}
const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    newTrip: (trip) => {
      dispatch({ type: "NEW_TRIP", trip: trip });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(scheduler);
