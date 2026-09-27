import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// پیدا کردن المان اصلی صفحه (سازگار با هر دو شناسه root یا app)
const rootElement = document.getElementById("root") || document.getElementById("app");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);