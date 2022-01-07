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
    console.log(action + "ACCCTTTIONNNN");
    state = {
      ...state,
      trips: [...state.trips, action.trip],
    };
  }

  return state;
});

export default store;
