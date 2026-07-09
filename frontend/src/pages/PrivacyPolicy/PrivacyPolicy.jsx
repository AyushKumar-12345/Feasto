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
                    <h3>Information We Collect</h3>
                    <p>
                        We collect your account details, delivery address, and preferences to make your food ordering experience faster and smoother.
                    </p>
                </section>

                <section className="static-section">
                    <h3>How We Protect Your Data</h3>
                    <p>
                        Your account information is securely protected using secure web tokens (JWT) and encrypted network connections to ensure your data stays safe and private.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPolicy;