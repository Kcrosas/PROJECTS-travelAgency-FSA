import { createStore } from "redux";

const initialState = {
  clients: [],
  destinations: [],
  trips: [],
  seven: [],
  currentView: [],
};
const store = createStore((state = initialState, action) => {
  if (action.type === "LOAD_EVERYTHING") {
    state = {
      ...state,
      clients: action.clients,
      destinations: action.destinations,
      trips: action.trips,
      seven: action.seven,
    };
  }
  if (action.type === "NEW_TRIP") {
    state = {
      ...state,
      trips: [...state.trips, action.trip],
    };
  }
  if (action.type === "DELETE_TRIP") {
    state = {
      ...state,
      trips: [...state.trips.filter((e) => e.id !== action.id)],
    };
  }
  if (action.type === "DELAYER") {
    const newTrips = state.trips.slice();
    newTrips.filter((e) => e.id === action.payload.id);
    //console.log(newTrips);
    state = {
      ...state,
      trips: [
        ...state.trips.map((e) => {
          if (e.id === action.payload.id) {
            e.date = action.payload.newDate;
            return e;
          } else {
            return e;
          }
        }),
      ],
    };
  }

  return state;
});

export default store;
