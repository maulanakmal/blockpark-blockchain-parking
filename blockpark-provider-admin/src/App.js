import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import MainPage from "./Main";
import ProfilesPage from "./Profile";

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route exact path="/profile" element={<ProfilesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
