import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./StaticPages.css";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="static-page-container">
            <header className="static-page-header">
                <button 
                    type="button" 
                    className="back-nav-btn" 
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <h2>Privacy Policy</h2>
            </header>

            <main className="static-page-content">
                <section className="static-section">
                    <h3>Data Collection</h3>
                    <p>
                        We securely collect localized credentials, shipping target coordinates, and preference cookies strictly to elevate order dispatch velocity and personalized interface workflows.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Security Standardizations</h3>
                    <p>
                        Your network records are fully encrypted via JSON Web Token (JWT) verification models and end-to-end communication channels to rule out third-party leaks.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPolicy;