import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Add from "./pages/Add/Add.jsx";
import List from "./pages/List/List.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Login from "./pages/Login/Login.jsx";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const url = import.meta.env.DEV
        ? ""
        : import.meta.env.VITE_BACKEND_URL ||
          "https://feasto-backend-pcbq.onrender.com";

    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem("adminToken");

        if (!storedToken) return "";

        try {
            const segments = storedToken.split(".");
            if (segments.length !== 3 || !segments.every(Boolean)) {
                throw new Error("Malformed admin token.");
            }
            const header = JSON.parse(
                window.atob(
                    segments[0]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                        .padEnd(segments[0].length + ((4 - (segments[0].length % 4)) % 4), "=")
                )
            );
            const encodedPayload = segments[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/");
            const paddedPayload = encodedPayload.padEnd(
                encodedPayload.length + ((4 - (encodedPayload.length % 4)) % 4),
                "="
            );
            const payload = JSON.parse(window.atob(paddedPayload));

            if (
                payload.role !== "admin" ||
                payload.sub !== "admin" ||
                payload.iss !== "feasto-api" ||
                payload.aud !== "feasto-admin" ||
                header.alg !== "HS256" ||
                !Number.isFinite(payload.exp) ||
                payload.exp <= Date.now() / 1000
            ) {
                localStorage.removeItem("adminToken");
                return "";
            }
        } catch {
            localStorage.removeItem("adminToken");
            return "";
        }

        return storedToken;
    });

    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && token) {
                    localStorage.removeItem("adminToken");
                    setToken("");
                    toast.info("Your admin session has expired. Please sign in again.");
                }

                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptorId);
    }, [token]);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="light"
            />

            {!token ? (
                <Login
                    url={url}
                    setToken={setToken}
                />
            ) : (
                <div className="admin-layout">
                    <Navbar setToken={setToken} />

                    <div className="app-content">
                        <Sidebar />

                        <main className="main-content-area">
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="/add" replace />}
                                />
                                <Route
                                    path="/add"
                                    element={<Add url={url} />}
                                />
                                <Route
                                    path="/list"
                                    element={<List url={url} />}
                                />
                                <Route
                                    path="/orders"
                                    element={<Orders url={url} />}
                                />
                                <Route
                                    path="*"
                                    element={<Navigate to="/add" replace />}
                                />
                            </Routes>
                        </main>
                    </div>

                    <Footer />
                </div>
            )}
        </>
    );
};

export default App;