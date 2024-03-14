// App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Data from "./components/Data";
import Details from "./components/Details";
//.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Data />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
  