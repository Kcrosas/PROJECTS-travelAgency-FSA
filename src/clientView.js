import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class views extends Component {
  constructor(props) {
    super(props);
  }

  Delay = async (id) => {
    try {
      const delayed = (await axios.put(`/api/trips/delay7/${id}`)).data;
      const newDate = delayed.date;
      const payload = {
        newDate: newDate,
        id: id,
      };
      this.props.delayer(id, payload);
    } catch (ex) {
      console.log(ex);
    }
  };

  Delete = async (id) => {
    try {
      await axios.delete(`/api/trips/${id}`);
      this.props.deleter(id);
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    let id = window.location.hash.slice(-1) * 1;
    const client = this.props.clients.filter((e) => e.id === id);
    console.log(client[0]);
    const date = new Date().getTime;
    const filtered = this.props.trips.filter((e) => {
      return e.client.id === id;
    });
    return (
      <div>
        <h1>TRIPS</h1>
        <button onClick={() => this.props.history.push(`/`)}>
          Cancel / Return to Main Page
        </button>
        <table>
          <tbody>
            <tr>
              <td>Destination</td>
              <td>Trip Date</td>
              <td>Name Confirmation</td>
              <td>Purpose of Trip</td>
              <td>Trip ID</td>
              <td>Delay Option</td>
              <td>Cancel Trip</td>
            </tr>
            {filtered.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.destination.name}</td>
                <td>{trip.date}</td>
                <td>{trip.client.name}</td>
                <td>{trip.purpose}</td>
                <td>{trip.id}</td>
                <td>
                  <button onClick={() => this.Delay(trip.id)}>
                    Delay by 1 Week
                  </button>
                </td>
                <td>
                  <button
                    disabled={new Date(trip.date).getTime() > date}
                    onClick={() => this.Delete(trip.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    deleter: async (id) => {
      dispatch({ type: "DELETE_TRIP", id });
    },
    delayer: async (payload) => {
      dispatch({ type: "DELAYER", payload });
    },
  };
};

const clientView = connect(mapStateToProps, mapDispatchToProps)(views);
export default clientView;
