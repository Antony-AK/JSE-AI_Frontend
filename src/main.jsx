import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { ProfileImageProvider } from "./base/ProfileEditor/ProfileImageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProfileImageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProfileImageProvider>
  </React.StrictMode >
);