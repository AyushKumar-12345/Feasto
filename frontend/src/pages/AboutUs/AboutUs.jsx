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
                        Launched with a mission to simplify online ordering and transform food delivery, Feasto bridges the connection between local restaurants and food lovers looking for fresh, delicious meals.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Why Choose Us?</h3>
                    <p>
                        We offer an easy-to-use menu platform, quick online payment checkouts, and reliable order tracking systems to ensure your food arrives fresh, hot, and right on time.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default AboutUs;