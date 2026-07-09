import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

const Footer = () => {
    const scrollTo = (id) => {
        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    return (
        <footer
            className="footer"
            id="footer"
        >
            <div className="footer-content">
                <div className="footer-content-left">
                    <img
                        src={assets.logo}
                        alt="Feasto Logo"
                        className="footer-logo"
                        onClick={() => scrollTo("home")}
                    />

                    <p>
                        Feasto brings your favorite meals
                        right to your doorstep. Explore a
                        wide variety of delicious dishes,
                        enjoy fast delivery, and satisfy
                        your cravings with a seamless food
                        ordering experience.
                    </p>

                    <div className="footer-social-icons">
                        <a
                            href="https://github.com/AyushKumar-12345"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon-link"
                            title="GitHub"
                        >
                            <FaGithub size={20} />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/ayush-kumar-97326636a/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon-link"
                            title="LinkedIn"
                        >
                            <FaLinkedin size={20} />
                        </a>
                    </div>
                </div>

                <div className="footer-content-center">
                    <h2>Company</h2>

                    <ul>
                        <li onClick={() => scrollTo("home")}>
                            Home
                        </li>

                        <li>
                            <Link to="/about" className="footer-nav-link">
                                About Us
                            </Link>
                        </li>

                        <li onClick={() => scrollTo("app-download")}>
                            Delivery
                        </li>

                        <li>
                            <Link to="/privacy" className="footer-nav-link">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-content-right">
                    <h2>Connect With Me</h2>

                    <ul className="contact-list">
                        <li>
                            <a
                                href="https://github.com/AyushKumar-12345"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                            >
                                <FaGithub size={20} />

                                <div>
                                    <strong>GitHub</strong>
                                    <p>View my projects</p>
                                </div>
                            </a>
                        </li>

                        <li>
                            <a
                                href="https://www.linkedin.com/in/ayush-kumar-97326636a/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                            >
                                <FaLinkedin size={20} />

                                <div>
                                    <strong>LinkedIn</strong>
                                    <p>Let's connect</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <hr />

            <p className="footer-copyright">
                © {new Date().getFullYear()} Feasto.
                All Rights Reserved.
            </p>
        </footer>
    );
};

export default Footer;