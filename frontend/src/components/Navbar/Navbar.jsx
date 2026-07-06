import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import SearchPopup from "../SearchPopup/SearchPopup";
import {
    Search,
    ShoppingBasket,
    User,
    ShoppingBag,
    LogOut,
} from "lucide-react";

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [showSearch, setShowSearch] =
        useState(false);
    const [showProfile, setShowProfile] =
        useState(false);

    const profileRef = useRef(null);

    const {
        getTotalCartAmount,
        token,
        setToken,
        profileImage,
    } = useContext(StoreContext);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/") {
            setMenu("");
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    switch (entry.target.id) {
                        case "home":
                            setMenu("home");
                            break;

                        case "explore-menu":
                            setMenu("menu");
                            break;

                        case "app-download":
                            setMenu("app");
                            break;

                        case "footer":
                            setMenu("contact");
                            break;

                        default:
                            break;
                    }
                });
            },
            {
                threshold: 0.45,
            }
        );

        [
            "home",
            "explore-menu",
            "app-download",
            "footer",
        ].forEach((id) => {
            const section =
                document.getElementById(id);

            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfile(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setShowProfile(false);
        scrollToTop();
        navigate("/");
    };

    return (
        <>
            {showSearch && (
                <SearchPopup
                    setShowSearch={setShowSearch}
                />
            )}

            <nav className="navbar">
                <Link
                    to="/"
                    title="Feasto"
                    onClick={() => {
                        setMenu("home");
                        scrollToTop();
                    }}
                >
                    <img
                        src={assets.logo}
                        alt="Feasto Logo"
                        className="logo"
                    />
                </Link>

                <ul className="navbar-menu">
                    <Link
                        to="/"
                        className={
                            menu === "home"
                                ? "active"
                                : ""
                        }
                        onClick={() => {
                            setMenu("home");
                            scrollToTop();
                        }}
                    >
                        Home
                    </Link>

                    <a
                        href="#explore-menu"
                        className={
                            menu === "menu"
                                ? "active"
                                : ""
                        }
                    >
                        Menu
                    </a>

                    <a
                        href="#app-download"
                        className={
                            menu === "app"
                                ? "active"
                                : ""
                        }
                    >
                        Mobile App
                    </a>

                    <a
                        href="#footer"
                        className={
                            menu === "contact"
                                ? "active"
                                : ""
                        }
                    >
                        Contact Us
                    </a>
                </ul>

                <div className="navbar-right">
                    <button
                        type="button"
                        className="navbar-icon-wrapper"
                        onClick={() =>
                            setShowSearch(true)
                        }
                    >
                        <Search
                            className="lucide-icon"
                            size={22}
                        />
                    </button>

                    <div className="navbar-search-icon">
                        <Link to="/cart">
                            <ShoppingBasket
                                className="lucide-icon"
                                size={24}
                            />
                        </Link>

                        {getTotalCartAmount() >
                            0 && (
                            <div className="dot"></div>
                        )}
                    </div>

                    {!token ? (
                        <button
                            className="signin-btn"
                            onClick={() =>
                                setShowLogin(true)
                            }
                        >
                            Sign In
                        </button>
                    ) : (
                        <div
                            ref={profileRef}
                            className={`navbar-profile ${
                                showProfile
                                    ? "open"
                                    : ""
                            }`}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="profile-trigger profile-image"
                                    onClick={() =>
                                        setShowProfile(
                                            !showProfile
                                        )
                                    }
                                />
                            ) : (
                                <User
                                    className="profile-trigger"
                                    size={24}
                                    onClick={() =>
                                        setShowProfile(
                                            !showProfile
                                        )
                                    }
                                />
                            )}

                            <ul className="nav-profile-dropdown">
                                <li
                                    onClick={() => {
                                        setShowProfile(
                                            false
                                        );
                                        scrollToTop();
                                        navigate(
                                            "/profile"
                                        );
                                    }}
                                >
                                    <User size={18} />
                                    <p>My Profile</p>
                                </li>

                                <hr />

                                <li
                                    onClick={() => {
                                        setShowProfile(
                                            false
                                        );
                                        scrollToTop();
                                        navigate(
                                            "/myorders"
                                        );
                                    }}
                                >
                                    <ShoppingBag
                                        size={18}
                                    />
                                    <p>My Orders</p>
                                </li>

                                <hr />

                                <li
                                    onClick={logout}
                                >
                                    <LogOut
                                        size={18}
                                    />
                                    <p>Logout</p>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;