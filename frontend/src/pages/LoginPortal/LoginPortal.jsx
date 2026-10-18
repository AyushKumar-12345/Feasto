import React from "react";
import { ArrowRight, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LoginPortal.css";

const LoginPortal = ({ setShowLogin }) => {
    const navigate = useNavigate();
    const adminUrl =
        import.meta.env.VITE_ADMIN_URL ||
        (import.meta.env.DEV || (typeof window !== "undefined" && window.location.hostname === "localhost")
            ? "http://localhost:5174"
            : "https://feasto-admin-567d.onrender.com");

    const openCustomerLogin = (mode = "Login") => {
        navigate("/");
        setShowLogin(mode);
    };

    return (
        <section className="login-portal">
            <div className="login-portal-heading">
                <span className="login-portal-eyebrow">WELCOME TO FEASTO</span>
                <h1>How would you like to sign in?</h1>
                <p>Choose the account type that matches what you want to do.</p>
            </div>

            <div className="login-portal-options">
                <article className="login-portal-card">
                    <div className="login-portal-icon customer">
                        <UtensilsCrossed size={25} />
                    </div>
                    <span className="login-portal-label">FOR CUSTOMERS</span>
                    <h2>Order something delicious</h2>
                    <p>
                        Explore the menu, place an order, and keep track of your
                        deliveries.
                    </p>
                    <button
                        type="button"
                        className="login-portal-button customer-button"
                        onClick={() => openCustomerLogin("Login")}
                    >
                        Customer login <ArrowRight size={18} />
                    </button>
                    <button
                        type="button"
                        className="login-portal-button customer-signup-button"
                        onClick={() => openCustomerLogin("Sign Up")}
                    >
                        Create an account <ArrowRight size={18} />
                    </button>
                </article>

                <article className="login-portal-card">
                    <div className="login-portal-icon admin">
                        <ShieldCheck size={25} />
                    </div>
                    <span className="login-portal-label">FOR RESTAURANT ADMINS</span>
                    <h2>Manage your restaurant</h2>
                    <p>
                        Sign in to manage food items, review orders, and update
                        their status.
                    </p>
                    <a
                        className="login-portal-button admin-button"
                        href={adminUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Admin login <ArrowRight size={18} />
                    </a>
                </article>
            </div>
        </section>
    );
};

export default LoginPortal;
