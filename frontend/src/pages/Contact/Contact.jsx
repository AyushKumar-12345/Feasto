import React, { useState } from "react";
import {
    ArrowLeft,
    ArrowUpRight,
    ExternalLink,
    Mail,
    MessageCircle,
    ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Contact.css";
import "../AboutUs/StaticPages.css";

const Contact = () => {
    const navigate = useNavigate();
    const email = "ayushkumardandapat200@gmail.com";
    const formId = import.meta.env.VITE_FORMSPREE_FORM_ID?.trim();
    const [formStatus, setFormStatus] = useState("idle");
    const [statusMessage, setStatusMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;

        if (!formId) {
            setFormStatus("configuration");
            setStatusMessage(
                "The email form isn't connected yet. Add your Formspree form ID to VITE_FORMSPREE_FORM_ID."
            );
            return;
        }

        setIsSubmitting(true);
        setFormStatus("idle");
        setStatusMessage("");

        try {
            const formspreeEndpoint = formId.startsWith("http://") || formId.startsWith("https://")
                ? formId
                : `https://formspree.io/f/${encodeURIComponent(formId)}`;

            const response = await fetch(formspreeEndpoint, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new FormData(form),
            });

            if (!response.ok) {
                let message = "We couldn't send your message. Please try again or email support directly.";
                try {
                    const result = await response.json();
                    if (Array.isArray(result.errors) && result.errors.length > 0) {
                        message = result.errors.map((error) => error.message).join(" ");
                    }
                } catch (parseError) {
                    console.error("Couldn't read the contact form error response.", parseError);
                }
                throw new Error(message);
            }

            form.reset();
            setFormStatus("success");
            setStatusMessage("Thanks for getting in touch. Your message has been sent.");
        } catch (error) {
            console.error("Contact form submission failed.", error);
            setFormStatus("error");
            setStatusMessage(error.message || "We couldn't send your message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="static-page-container contact-page">
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
                <h2>Contact Feasto</h2>
            </header>

            <div className="static-page-content">
                <section className="contact-intro">
                    <span className="contact-eyebrow">WE'RE HERE TO HELP</span>
                    <h3>Let’s make your Feasto experience better.</h3>
                    <p>
                        Have a question about an order, your account, or your
                        privacy? Send us a note or choose the support route that
                        best fits what you need.
                    </p>
                </section>

                <section className="contact-form-card" aria-labelledby="contact-form-title">
                    <div className="contact-form-heading">
                        <div>
                            <span className="contact-eyebrow">SEND A MESSAGE</span>
                            <h3 id="contact-form-title">How can we help?</h3>
                        </div>
                        <span className="contact-form-icon"><Mail size={21} /></span>
                    </div>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="contact-form-fields">
                            <label>
                                Your name
                                <input
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    maxLength="100"
                                    required
                                    placeholder="e.g. Alex Smith"
                                />
                            </label>
                            <label>
                                Email address
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    maxLength="254"
                                    required
                                    placeholder="you@example.com"
                                />
                            </label>
                            <label className="contact-form-full">
                                Subject
                                <input
                                    name="_subject"
                                    type="text"
                                    maxLength="120"
                                    required
                                    placeholder="What can we help with?"
                                />
                            </label>
                            <label className="contact-form-full">
                                Order reference <span className="contact-optional">(optional)</span>
                                <input
                                    name="order_reference"
                                    type="text"
                                    maxLength="80"
                                    placeholder="Only if your message is about an order"
                                />
                            </label>
                            <label className="contact-form-full">
                                Message
                                <textarea
                                    name="message"
                                    rows="5"
                                    minLength="10"
                                    maxLength="3000"
                                    required
                                    placeholder="Tell us a little more..."
                                />
                            </label>
                        </div>
                        <label className="contact-honeypot" aria-hidden="true">
                            Leave this field empty
                            <input name="_gotcha" type="text" tabIndex="-1" autoComplete="off" />
                        </label>
                        {statusMessage && (
                            <p
                                className={`contact-form-status is-${formStatus}`}
                                role={formStatus === "error" ? "alert" : "status"}
                                aria-live="polite"
                            >
                                {statusMessage}
                                {formStatus === "configuration" && (
                                    <> For now, you can <a href={`mailto:${email}`}>email support directly</a>.</>
                                )}
                            </p>
                        )}
                        <div className="contact-form-submit-row">
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sending…" : "Send message"}
                                {!isSubmitting && <ArrowUpRight size={17} />}
                            </button>
                            <span>Your details are used to reply to your message.</span>
                        </div>
                        <p className="contact-form-privacy">
                            Messages are delivered using Formspree, a third-party form service.
                            Avoid including passwords or full payment details. See our{" "}
                            <Link to="/privacy">Privacy Policy</Link>.
                        </p>
                    </form>
                </section>

                <section className="contact-options" aria-label="Other contact options">
                    <a
                        className="contact-option"
                        href={`mailto:${email}?subject=${encodeURIComponent("Feasto support")}`}
                    >
                        <span className="contact-option-icon">
                            <Mail size={21} />
                        </span>
                        <span className="contact-option-copy">
                            <strong>Email support</strong>
                            <span>{email}</span>
                            <small>For account, order, or general questions</small>
                        </span>
                        <ArrowUpRight size={18} className="contact-option-arrow" />
                    </a>

                    <a
                        className="contact-option"
                        href="https://github.com/AyushKumar-12345/Feasto/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="contact-option-icon">
                            <MessageCircle size={21} />
                        </span>
                        <span className="contact-option-copy">
                            <strong>Report a technical issue</strong>
                            <span>Feasto on GitHub</span>
                            <small>Share reproducible bugs or feature ideas</small>
                        </span>
                        <ArrowUpRight size={18} className="contact-option-arrow" />
                    </a>

                    <Link className="contact-option" to="/privacy">
                        <span className="contact-option-icon">
                            <ShieldCheck size={21} />
                        </span>
                        <span className="contact-option-copy">
                            <strong>Privacy and personal data</strong>
                            <span>Read the privacy policy</span>
                            <small>Request access, correction, or deletion</small>
                        </span>
                        <ArrowUpRight size={18} className="contact-option-arrow" />
                    </Link>
                </section>

                <section className="static-section contact-note">
                    <h3>When you get in touch</h3>
                    <p>
                        Include the email address associated with your account
                        and, for an order question, the order reference shown in
                        My Orders. Please do not send your password, full card
                        number, security code, or other payment credentials.
                        Feasto does not publish a guaranteed response time.
                    </p>
                    <a href="https://formspree.io/" target="_blank" rel="noopener noreferrer">
                        Find your Formspree form ID <ExternalLink size={14} />
                    </a>
                </section>
            </div>
        </div>
    );
};

export default Contact;
