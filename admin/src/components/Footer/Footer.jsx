import React from "react";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="admin-footer">
            <div className="footer-content">
                <p>&copy; {currentYear} Feasto. All rights reserved.</p>
                <div className="footer-links">
                    <span>Admin Control Suite v1.0.0</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;