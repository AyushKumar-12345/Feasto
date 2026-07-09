import React from "react";
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
    const scrollToMenu = () => {
        document
            .getElementById("explore-menu")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    return (
        <section
            className="header"
            id="home"
        >
            <img
                src={assets.header_img}
                alt="Delicious Food"
                className="header-image"
            />

            <div className="header-overlay">
                <div className="header-content">
                    {/* Duplicate text blocks removed because they are pre-rendered into the header_img graphic asset.
                      We preserve the layout positions and actions seamlessly.
                    */}
                    
                    <div className="header-actions">
                        <button
                            type="button"
                            className="header-btn"
                            onClick={scrollToMenu}
                        >
                            Explore Menu
                        </button>

                        <span className="header-trust">
                            1000+ Happy Customers
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;