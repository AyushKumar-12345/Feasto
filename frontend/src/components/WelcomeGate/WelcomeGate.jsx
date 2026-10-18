import React from "react";
import { ShieldCheck, UtensilsCrossed, UserRoundPlus, Lock } from "lucide-react";
import "./WelcomeGate.css";

const WelcomeGate = ({ onLogin, onSignUp }) => {
    const adminUrl =
        import.meta.env.VITE_ADMIN_URL ||
        (import.meta.env.DEV || (typeof window !== "undefined" && window.location.hostname === "localhost")
            ? "http://localhost:5174"
            : "https://feasto-admin-567d.onrender.com");

    return (
        <div className="welcome-gate-backdrop">
            <section
                className="welcome-gate"
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-gate-title"
            >
                <div className="welcome-gate-header">
                    <span className="welcome-gate-badge">
                        <Lock size={13} aria-hidden="true" />
                        AUTHENTICATION REQUIRED
                    </span>
                    <h1 id="welcome-gate-title">
                        Welcome to <span>Feasto</span>
                    </h1>
                    <p>
                        Please sign in, create a new customer account, or access the restaurant admin panel to continue.
                    </p>
                </div>

                <div className="welcome-gate-options">
                    <button
                        type="button"
                        className="welcome-btn customer-login"
                        onClick={onLogin}
                    >
                        <UtensilsCrossed size={19} aria-hidden="true" />
                        <span>Customer Log In</span>
                    </button>

                    <button
                        type="button"
                        className="welcome-btn customer-signup"
                        onClick={onSignUp}
                    >
                        <UserRoundPlus size={19} aria-hidden="true" />
                        <span>Create Customer Account</span>
                    </button>

                    <div className="welcome-gate-divider">
                        <span>OR</span>
                    </div>

                    <a
                        className="welcome-btn admin-portal"
                        href={adminUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ShieldCheck size={19} aria-hidden="true" />
                        <span>Restaurant Admin Portal</span>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default WelcomeGate;
