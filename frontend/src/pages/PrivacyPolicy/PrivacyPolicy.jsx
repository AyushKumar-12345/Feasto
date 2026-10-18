import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../AboutUs/StaticPages.css";

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
                <div>
                    <span className="policy-eyebrow">YOUR DATA, EXPLAINED</span>
                    <h2>Privacy Policy</h2>
                </div>
            </header>

            <div className="static-page-content">
                <p className="policy-updated">Last updated: October 18, 2026</p>

                <section className="static-section">
                    <h3>1. About this policy</h3>
                    <p>
                        This policy explains how the Feasto food-ordering
                        application handles information when you browse the
                        menu, create an account, place orders, contact us, or
                        use optional features such as delivery tracking and the
                        AI assistant. Feasto is a learning and portfolio
                        project. Please do not use it to submit information
                        that is not needed to use the service.
                    </p>
                </section>

                <section className="static-section">
                    <h3>2. Information handled</h3>
                    <ul className="feature-list">
                        <li>
                            <strong>Account details:</strong> name, email
                            address, and a password stored as a password hash.
                        </li>
                        <li>
                            <strong>Orders:</strong> selected items,
                            quantities, totals, order status, delivery details,
                            and payment-provider references needed to process
                            and support an order.
                        </li>
                        <li>
                            <strong>Delivery location:</strong> if you choose
                            to share a checkout pin, its coordinates are
                            associated with that order. While rider tracking is
                            active, the rider's device coordinates and update
                            time are shown to the customer for that order.
                        </li>
                        <li>
                            <strong>Saved preferences:</strong> favorites and
                            some account display preferences are stored in
                            your browser's local storage.
                        </li>
                        <li>
                            <strong>Support messages:</strong> your name,
                            email address, subject, optional order reference,
                            and message when you use the contact form or email
                            the project team.
                        </li>
                    </ul>
                </section>

                <section className="static-section">
                    <h3>3. How information is used</h3>
                    <ul className="feature-list">
                        <li>Register and authenticate customer accounts.</li>
                        <li>Prepare, pay for, deliver, and track orders.</li>
                        <li>Maintain the menu and restaurant operations.</li>
                        <li>Respond to support requests and resolve issues.</li>
                        <li>Protect the service and investigate misuse.</li>
                    </ul>
                </section>

                <section className="static-section">
                    <h3>4. Services that help Feasto operate</h3>
                    <p>
                        Feasto uses service providers to host the application
                        and database, store uploaded food images, process
                        payments, display maps, load the Outfit typeface, and answer AI-assistant
                        requests. Depending on the feature you use, relevant
                        information may be processed by Render, MongoDB Atlas,
                        Cloudinary, Razorpay, OpenStreetMap tile services,
                        Google Fonts, Google Gemini, or Formspree under their own terms and
                        privacy practices. Contact-form submissions are
                        delivered through Formspree when it is configured.
                        Loading Google Fonts and map tiles
                        can disclose standard connection data such as your IP
                        address and browser information to those providers.
                        Payment credentials are entered with the payment
                        provider; Feasto does not intentionally store full
                        card numbers or security codes.
                    </p>
                </section>

                <section className="static-section">
                    <h3>5. AI assistant</h3>
                    <p>
                        If you use the assistant, your message, a limited
                        recent chat context, and relevant menu details are sent
                        to Google Gemini to produce a reply. When you are signed in,
                        the backend may also include brief summaries of up to
                        five of your recent paid orders (status, item names
                        and quantities, and date). Delivery addresses, phone
                        numbers, payment details, and precise location are not
                        included in those summaries. Feasto does not save chat
                        history in its database, but the provider processes the
                        request under its own terms. Do not include passwords,
                        payment credentials, or other sensitive information in
                        chat.
                    </p>
                </section>

                <section className="static-section">
                    <h3>6. Browser storage and security</h3>
                    <p>
                        Customer and admin sign-in tokens are kept in browser
                        local storage so the app can maintain a session.
                        Favorites and display preferences are also kept there.
                        Avoid signing in on a shared device and sign out when
                        you are finished. Feasto uses password hashing,
                        expiring signed tokens, role checks on protected API
                        routes, and HTTPS on its deployed services where
                        configured. No website or storage system can be
                        guaranteed completely secure.
                    </p>
                </section>

                <section className="static-section">
                    <h3>7. Maps and optional location</h3>
                    <p>
                        Sharing your location at checkout is optional. You can
                        place an order without granting browser location
                        permission. If you open a tracking map, map tiles are
                        loaded from OpenStreetMap services and your browser
                        connects to those services. Rider sharing is intended
                        to run only while an administrator has enabled
                        tracking for an order; updates stop when tracking is
                        stopped or delivery is completed.
                    </p>
                </section>

                <section className="static-section">
                    <h3>8. Retention and your choices</h3>
                    <p>
                        Account and order records are retained in the service
                        database as needed to operate the application, support
                        orders, and maintain its security. Browser-stored
                        favorites can be removed through your browser storage
                        settings. To ask about accessing, correcting, or
                        deleting account information, contact us; we may need
                        to verify your identity and may retain records where
                        required for legitimate operational or legal reasons.
                    </p>
                </section>

                <section className="static-section">
                    <h3>9. Children</h3>
                    <p>
                        Feasto is not designed for children to create accounts
                        or place orders independently. If you believe a child
                        has provided personal information, please contact us
                        so we can review the request.
                    </p>
                </section>

                <section className="static-section">
                    <h3>10. Changes and contact</h3>
                    <p>
                        This notice may change as the application evolves.
                        Updated text and its revision date will be posted on
                        this page. For privacy questions or requests, use the
                        details on our <Link to="/contact">Contact page</Link>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
