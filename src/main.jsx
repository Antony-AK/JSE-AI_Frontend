import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { ProfileImageProvider } from "./base/ProfileEditor/ProfileImageContext";
import { JobProvider } from "./Pages/6_my_jobs/JobContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProfileImageProvider>
      <BrowserRouter>
      <JobProvider>
        <App />
        </JobProvider>
      </BrowserRouter>
    </ProfileImageProvider>
  </React.StrictMode >
);