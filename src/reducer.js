const initialState = {
  savedMarkers: {},
  markersHistory: {
    "Colis Web Lille": [[50.632787, 3.01809], 18]
  },
  markers: {},
  currentMapMarker: {
    "Colis Web Lille": {
      coordinates: [[50.632787, 3.01809], 18],
      collection: "markersHistory"
    }
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "DISPATCH_MARKERS":
      return {
        ...state,
        markersHistory: { ...state.markersHistory, ...action.value },
        markers: { ...action.value }
      };
    case "SELECT_MARKER":
      return {
        ...state,
        currentMapMarker: action.value
      };
    case "SAVE_MARKER":
      return {
        ...state,
        savedMarkers: { ...state.savedMarkers, ...action.value }
      };
    case "DELETE_MARKER":
      return {
        ...state,
        savedMarkers: action.value
      };
    case "RETRIEVE_SAVED_MARKERS":
      return {
        ...state,
        savedMarkers: { ...action.value }
      };
    default:
      return state;
  }
};

export default reducer;
