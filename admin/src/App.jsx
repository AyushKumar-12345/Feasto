import React, { useState } from "react";
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
    const url =
        import.meta.env.VITE_BACKEND_URL || "https://feasto-backend-pcbg.onrender.com";

    const [token, setToken] = useState(localStorage.getItem("token"));

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