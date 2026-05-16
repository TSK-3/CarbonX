import React from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";
import { App } from "./App.jsx";
import { I18nProvider } from "./i18n/I18nContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
