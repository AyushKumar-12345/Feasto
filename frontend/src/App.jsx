import React, { useContext, useState } from "react";
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
import Contact from "./pages/Contact/Contact";
import Terms from "./pages/Terms/Terms";
import LoginPortal from "./pages/LoginPortal/LoginPortal";
import Favorites from "./pages/Favorites/Favorites";
import AIAssistant from "./components/AIAssistant/AIAssistant";
import WelcomeGate from "./components/WelcomeGate/WelcomeGate";
import { StoreContext } from "./context/StoreContextValue";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const { token } = useContext(StoreContext);
    const [showLogin, setShowLogin] = useState(false);
    const [loginInitialState, setLoginInitialState] = useState("Login");

    const openCustomerAuth = (mode) => {
        setLoginInitialState(mode);
        setShowLogin(true);
    };

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
                <LoginPopup
                    setShowLogin={setShowLogin}
                    initialState={loginInitialState}
                />
            )}

            {!token && !showLogin && (
                <WelcomeGate
                    onLogin={() => openCustomerAuth("Login")}
                    onSignUp={() => openCustomerAuth("Sign Up")}
                />
            )}

            <div className="app">
                <ScrollToTop />

                <Navbar />

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={
                                <LoginPortal
                                    setShowLogin={openCustomerAuth}
                                />
                            }
                        />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/order" element={<PlaceOrder />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/myorders" element={<MyOrders />} />
                        <Route path="/profile" element={<Profile />} />
                        
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/terms" element={<Terms />} />
                    </Routes>
                </main>

                <Footer />
            </div>
            <AIAssistant />
        </>
    );
};

export default App;