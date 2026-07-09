import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Camera,
    CircleUserRound,
    LogOut,
    Trash2,
    LayoutDashboard,
    Globe,
} from "lucide-react";
import { assets } from "../../assets/assets";
import "./Navbar.css";

const WEBSITE_URL = import.meta.env.VITE_FRONTEND_URL || "https://feasto-frontend-qt0n.onrender.com";

const Navbar = ({ setToken }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const [showMenu, setShowMenu] = useState(false);
    const [profileImage, setProfileImage] = useState(
        () => localStorage.getItem("adminProfile") || null
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/", { replace: true });
    };

    const goToDashboard = () => navigate("/add");
    const openWebsite = () => window.open(WEBSITE_URL, "_blank", "noopener,noreferrer");

    const handleProfileImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const SIZE = 200;
                canvas.width = SIZE;
                canvas.height = SIZE;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, SIZE, SIZE);
                const compressedImage = canvas.toDataURL("image/jpeg", 0.8);

                try {
                    localStorage.setItem("adminProfile", compressedImage);
                    setProfileImage(compressedImage);
                    setShowMenu(false);
                } catch {
                    alert("Storage is full. Please choose a smaller image.");
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const removeProfileImage = () => {
        localStorage.removeItem("adminProfile");
        setProfileImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setShowMenu(false);
    };

    return (
        <header className="navbar">
            <button
                type="button"
                className="logo-btn"
                onClick={goToDashboard}
                title="Dashboard"
            >
                <img
                    className="logo"
                    src={assets.logo}
                    alt="Feasto Admin Logo"
                />
            </button>

            <div className="navbar-center">
                <div className="navbar-title">
                    <LayoutDashboard size={24} className="dashboard-icon" />
                    <div className="title-text">
                        <h2>Feasto Admin Panel</h2>
                        <p>
                            Control your restaurant from one place — manage the menu and customer orders.
                        </p>
                    </div>
                </div>
            </div>

            <div className="navbar-right">
                <button
                    type="button"
                    className="website-btn"
                    onClick={openWebsite}
                >
                    <Globe size={16} />
                    <span>View Website</span>
                </button>

                <div className="admin-profile" ref={dropdownRef}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleProfileImage}
                    />

                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Admin Profile"
                            className="profile"
                            onClick={() => setShowMenu((prev) => !prev)}
                        />
                    ) : (
                        <CircleUserRound
                            className="profile"
                            size={42}
                            strokeWidth={1.8}
                            onClick={() => setShowMenu((prev) => !prev)}
                        />
                    )}

                    {showMenu && (
                        <div className="profile-dropdown">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera size={18} />
                                {profileImage ? "Change Photo" : "Upload Photo"}
                            </button>

                            {profileImage && (
                                <button
                                    type="button"
                                    onClick={removeProfileImage}
                                    style={{ color: "#dc2626" }}
                                >
                                    <Trash2 size={18} />
                                    Remove Photo
                                </button>
                            )}

                            <hr />

                            <button
                                type="button"
                                onClick={() => {
                                    setShowMenu(false);
                                    logoutHandler();
                                }}
                                style={{ color: "#b91c1c", fontWeight: "500" }}
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;