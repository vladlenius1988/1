import React from "react";
import ReactDOM from "react-dom";
import App from "/App.js";
import { BrowserRouter } from "react-router-dom";
//this should be the root of the src
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
