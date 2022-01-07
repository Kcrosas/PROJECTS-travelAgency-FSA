import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class views extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
    };
  }

  Delay = async (id) => {
    try {
      const delayed = (await axios.put(`/api/trips/delay7/${id}`)).data;
      if (this.state.toggle === false) {
        this.setState({ toggle: true });
      } else {
        this.setState({ toggle: false });
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  Delete = async (id) => {
    try {
      await axios.delete(`/api/trips/${id}`);
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    let id = window.location.hash.slice(-1) * 1;
    const client = this.props.clients.filter((e) => e.id === id);
    const date = new Date().getTime;
    const filtered = this.props.trips.filter((e) => {
      return e.client.id === id;
    });
    return (
      <div>
        <h1>{name}</h1>
        <ul>
          {filtered.map((trip) => (
            <li key={trip.id}>
              {trip.destination.name} || {trip.date} || {trip.client.name} ||
              {trip.purpose} ||
              {trip.id}
              <br />
              <button onClick={() => this.Delay(trip.id)}>
                Delay by 1 Week
              </button>
              <button
                disabled={new Date(trip.date).getTime() > date}
                onClick={() => this.Delete(trip.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    loadView: async () => {
      const id = window.location.hash.slice(1);
      dispatch({ type: "LOAD_VIEW", id });
    },
  };
};

const clientView = connect(mapStateToProps)(views);
export default clientView;
