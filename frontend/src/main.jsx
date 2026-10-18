import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import StoreContextProvider from "./context/StoreContext.jsx";

import "./index.css";

const navigationEntry = window.performance.getEntriesByType("navigation")[0];
if (navigationEntry?.type === "reload") {
    if (window.location.hash) {
        window.history.replaceState(
            window.history.state,
            "",
            `${window.location.pathname}${window.location.search}`
        );
    }

    window.addEventListener(
        "pageshow",
        () => window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
        { once: true }
    );
}

const rootElement = document.getElementById("root");

if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <BrowserRouter>
                <StoreContextProvider>
                    <App />
                </StoreContextProvider>
            </BrowserRouter>
        </StrictMode>
    );
}