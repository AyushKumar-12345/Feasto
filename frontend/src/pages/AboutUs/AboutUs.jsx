import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./StaticPages.css";

const AboutUs = () => {
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
                <h2>About Feasto</h2>
            </header>

            <main className="static-page-content">
                <section className="static-section">
                    <h3>Our Story</h3>
                    <p>
                        Launched with a mission to simplify restaurant operations and transform food delivery loops, Feasto bridge connections between localized culinary masterminds and food enthusiasts.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Why Choose Us?</h3>
                    <p>
                        We offer hyper-responsive logistical workflows, custom culinary discovery modules, and lightning-fast state synchronization across administrative layers to ensure your orders arrive hot and prompt.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default AboutUs;