import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../AboutUs/StaticPages.css";

const Terms = () => {
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
                <div>
                    <span className="policy-eyebrow">FEASTO SERVICE GUIDE</span>
                    <h2>Terms of Use</h2>
                </div>
            </header>

            <div className="static-page-content">
                <p className="policy-updated">Last updated: October 18, 2026</p>

                <section className="static-section">
                    <h3>Using Feasto</h3>
                    <p>
                        These terms describe the basic rules for using the
                        Feasto food-ordering application. Feasto is a learning
                        and portfolio project; features, availability, menu
                        items, prices, and delivery services may change. By
                        creating an account or placing an order, you agree to
                        use the service lawfully and provide accurate details
                        needed to fulfil your request.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Accounts and security</h3>
                    <p>
                        Keep your sign-in credentials private and notify us if
                        you believe someone else has accessed your account.
                        You are responsible for activity performed through
                        your signed-in session. Do not attempt to access
                        another person's account, interfere with the service,
                        or bypass its access controls.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Orders and payments</h3>
                    <p>
                        Review the items, delivery details, and total before
                        submitting an order. An order request may depend on
                        successful payment verification and restaurant
                        acceptance. Payments are handled by Razorpay under its
                        own terms. For an order issue, cancellation, or refund
                        question, contact Feasto with the order reference;
                        requests are reviewed against the order status and
                        applicable payment-provider rules.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Delivery and location features</h3>
                    <p>
                        Delivery estimates and tracking information are
                        provided for convenience and may be unavailable or
                        delayed. Sharing a delivery pin is optional. If rider
                        tracking is enabled for an order, location updates are
                        visible to the customer while sharing is active. Do not
                        misuse or attempt to interfere with location features.
                    </p>
                </section>

                <section className="static-section">
                    <h3>AI assistant</h3>
                    <p>
                        Assistant responses are generated automatically and
                        are informational only. They may be incomplete or
                        inaccurate and are not a substitute for confirmation
                        from Feasto support, the restaurant, or the payment
                        provider. Do not share passwords or payment credentials
                        in chat. See the <Link to="/privacy">Privacy Policy</Link>
                        {" "}for information about AI data processing.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Availability and changes</h3>
                    <p>
                        Feasto is provided on an evolving, best-effort basis.
                        We may update or temporarily suspend features for
                        maintenance, security, or operational reasons. Nothing
                        in this page limits rights that cannot legally be
                        limited. For questions, use our <Link to="/contact">Contact page</Link>.
                    </p>
                </section>

                <section className="static-section">
                    <h3>Project notice</h3>
                    <p>
                        This plain-language notice describes the current
                        project experience and is not legal advice. The
                        operator should obtain jurisdiction-specific legal
                        review before using Feasto as a commercial service.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
