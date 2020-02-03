import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./reset.css";
import "./App.css";
import SideBar from "./components/SideBar";
import Map from "./components/Map";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedMarkers = JSON.parse(localStorage.getItem("markers"));
    dispatch({ type: "RETRIEVE_SAVED_MARKERS", value: savedMarkers });
  }, [dispatch]);

  return (
    <div className="App">
      <SideBar />
      <Map />
    </div>
  );
};

export default App;
