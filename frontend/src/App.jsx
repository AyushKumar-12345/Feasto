import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Profile from "./pages/Profile/Profile";

import AboutUs from "./pages/AboutUs/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
            />

            {showLogin && (
                <LoginPopup setShowLogin={setShowLogin} />
            )}

            <div className="app">
                <ScrollToTop />

                <Navbar setShowLogin={setShowLogin} />

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/order" element={<PlaceOrder />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/myorders" element={<MyOrders />} />
                        <Route path="/profile" element={<Profile />} />
                        
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default App;