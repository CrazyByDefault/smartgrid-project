import React from 'react';
// import logo from './logo.svg';
import Graph from "./pages/Graph.jsx";
import Calendar from "./pages/Calendar.jsx";
import "antd/dist/antd.min.css";
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/calendar">
            <Calendar />
          </Route>
          <Route path="/">
            <Graph />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
