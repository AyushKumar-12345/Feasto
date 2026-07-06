import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const AppDownload = () => {
    const handleDownload = (platform) => {
        toast.info(
            `${platform} app is coming soon! 🚀`
        );
    };

    return (
        <section
            className="app-download"
            id="app-download"
        >
            <p>
                For a Better Experience, Download
                <br />
                Feasto App
            </p>

            <div className="app-download-platforms">
                <button
                    type="button"
                    className="store-btn"
                    onClick={() =>
                        handleDownload("Google Play")
                    }
                    aria-label="Google Play"
                >
                    <img
                        src={assets.play_store}
                        alt="Download Feasto on Google Play"
                    />
                </button>

                <button
                    type="button"
                    className="store-btn"
                    onClick={() =>
                        handleDownload("App Store")
                    }
                    aria-label="App Store"
                >
                    <img
                        src={assets.app_store}
                        alt="Download Feasto on the App Store"
                    />
                </button>
            </div>
        </section>
    );
};

export default AppDownload;