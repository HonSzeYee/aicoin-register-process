import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { useSettingsInit } from "./hooks/useSettings";

function AppWithSettings() {
  useSettingsInit();
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithSettings />
  </React.StrictMode>
);
