import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SideBar.scss";

const SideBar = () => {
  const dispatch = useDispatch();
  const [searchState, updateSearchState] = useState("WAITING_SEARCH");
  const [query, updateQuery] = useState("");
  const [markersSelectState, updateMarkersSelectState] = useState("markers");
  const markers = useSelector(state => state.markers);
  const markersHistory = useSelector(state => state.markersHistory);
  const savedMarkers = useSelector(state => state.savedMarkers);

  const fetchAddress = () => {
    updateSearchState("LOADING");
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        query.replace(/ /gm, "+") +
        "&limit=20"
    )
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.features.length > 0) {
          const newMarkers = {};
          jsonResponse.features.forEach(
            feature =>
              (newMarkers[feature.properties.label] = [
                [
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0]
                ],
                18
              ])
          );
          dispatch({ type: "DISPATCH_MARKERS", value: newMarkers });
          updateSearchState("RESULTS_OBTAINED");
          updateMarkersSelectState("markers");
        } else {
          updateSearchState("NO_RESULTS");
        }
      })
      .catch(err => {
        updateSearchState("ERROR_WHILE_FETCHING");
        console.log(err);
      });
  };

  const saveMarker = markerToSave => {
    localStorage.setItem(
      "markers",
      JSON.stringify({ ...savedMarkers, ...markerToSave })
    );
    dispatch({ type: "SAVE_MARKER", value: markerToSave });
  };

  const deleteMarker = markerToDelete => {
    const newSavedMarkers = { ...savedMarkers };
    delete newSavedMarkers[markerToDelete];
    localStorage.setItem("markers", JSON.stringify(newSavedMarkers));
    dispatch({ type: "DELETE_MARKER", value: newSavedMarkers });
  };

  const markersToDisplay =
    markersSelectState === "markers"
      ? markers
      : markersSelectState === "markersHistory"
      ? markersHistory
      : markersSelectState === "savedMarkers"
      ? savedMarkers
      : undefined;

  return (
    <div className="SideBar">
      <input
        type="text"
        value={query}
        placeholder="Search an address"
        onChange={e => updateQuery(e.target.value)}
      />
      <button className="search" onClick={fetchAddress}>
        Search
      </button>
      {searchState === "LOADING" ? (
        <p>Loading gouv API...</p>
      ) : searchState === "NO_RESULTS" ? (
        <p>No results in gouv API for your query</p>
      ) : searchState === "ERROR_WHILE_FETCHING" ? (
        <p>Error while fetching gouv API</p>
      ) : (
        <p></p>
      )}
      <select
        value={markersSelectState}
        onChange={e => updateMarkersSelectState(e.target.value)}
      >
        <option value="markers">Search results</option>
        <option value="markersHistory">Search results history</option>
        <option value="savedMarkers">Saved markers</option>
      </select>
      <div className="markersContainer">
        {Object.keys(markersToDisplay).map(marker => (
          <div className="markerBox" key={[markersToDisplay[marker], "search"]}>
            <button
              key={markersToDisplay[marker]}
              onClick={() => {
                const selectedMarker = {};
                selectedMarker[marker] = {
                  coordinates: markersToDisplay[marker],
                  collection: markersSelectState
                };
                dispatch({
                  type: "SELECT_MARKER",
                  value: selectedMarker
                });
              }}
            >
              {marker}
            </button>
            {savedMarkers[marker] === undefined ? (
              <button
                className="save"
                onClick={() => {
                  const markerToSave = {};
                  markerToSave[marker] = markersToDisplay[marker];
                  saveMarker(markerToSave);
                }}
              >
                Save
              </button>
            ) : markersSelectState === "savedMarkers" ? (
              <button
                className="save"
                onClick={() => {
                  deleteMarker(marker);
                }}
              >
                Del
              </button>
            ) : (
              undefined
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
