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
                    <h3>Welcome to Feasto</h3>

                    <p>
                        Feasto is a modern food delivery platform built to make
                        ordering your favorite meals simple, fast, and
                        enjoyable. Whether you're craving fresh salads,
                        delicious pasta, tasty desserts, or comfort food,
                        Feasto connects you with quality meals prepared by
                        trusted restaurants and delivered directly to your
                        doorstep.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Our Mission</h3>

                    <p>
                        Our mission is to make food ordering effortless by
                        combining a beautiful user experience with reliable
                        technology. We focus on providing customers with fresh
                        food, secure online payments, quick delivery, and
                        excellent customer satisfaction every single day.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Our Vision</h3>

                    <p>
                        We aim to become one of the most trusted food delivery
                        platforms by helping local restaurants reach more
                        customers while providing people with a seamless and
                        enjoyable dining experience from the comfort of their
                        homes.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Why Choose Feasto?</h3>

                    <ul className="feature-list">
                        <li>Freshly prepared meals from trusted restaurants</li>
                        <li>Simple and intuitive ordering experience</li>
                        <li>Secure online payments powered by Razorpay</li>
                        <li>Fast and reliable doorstep delivery</li>
                        <li>Real-time order tracking and status updates</li>
                        <li>Wide variety of cuisines and food categories</li>
                        <li>
                            Responsive experience across desktop and mobile
                            devices
                        </li>
                    </ul>
                </section>

                <section className="static-section">
                    <h3>Quality You Can Trust</h3>

                    <p>
                        Every feature in Feasto is designed with reliability,
                        security, and convenience in mind. From browsing the
                        menu to completing your payment and receiving your
                        order, we strive to deliver a smooth, safe, and
                        enjoyable experience for every customer.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Thank You</h3>

                    <p>
                        Thank you for choosing Feasto. We appreciate your trust
                        and look forward to serving delicious meals that make
                        every order worth remembering.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default AboutUs;