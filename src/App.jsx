// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Greetings from "./pages/Greetings";
import QRSection from "./pages/QRSection";
import Tables from "./pages/Tables";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Gallery />} />
        <Route path="/saludos" element={<Greetings />} />
        <Route path="/mesas" element={<Tables />} />
        <Route path="/cancion" element={<QRSection />} />
      </Routes>
    </Router>
  );
}

export default App;
