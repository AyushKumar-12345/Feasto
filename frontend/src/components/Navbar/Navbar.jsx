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
import { StoreContext } from "../../context/StoreContextValue";
import {
    ShoppingBasket,
    Heart,
    User,
    ShoppingBag,
    LogOut,
    ShieldCheck,
} from "lucide-react";

const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const [showProfile, setShowProfile] =
        useState(false);

    const profileRef = useRef(null);

    const {
        getTotalCartAmount,
        favoriteFoodIds,
        token,
        profileImage,
        logout,
    } = useContext(StoreContext);

    const navigate = useNavigate();
    const location = useLocation();
    const adminUrl =
        import.meta.env.DEV ||
        (typeof window !== "undefined" &&
            (window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1"))
            ? "http://localhost:5174"
            : import.meta.env.VITE_ADMIN_URL ||
              "https://feasto-admin-567d.onrender.com";

    useEffect(() => {
        if (location.pathname !== "/") {
            if (location.pathname === "/contact") {
                setMenu("contact");
            } else {
                setMenu("");
            }
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

                        case "food-display":
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
                rootMargin: "-20% 0px -50% 0px",
                threshold: 0,
            }
        );

        [
            "home",
            "food-display",
            "app-download",
            "footer",
        ].forEach((id) => {
            const section = document.getElementById(id);
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

    const handleNavClick = (sectionId, menuName) => {
        setMenu(menuName);
        if (location.pathname === "/") {
            const el =
                document.getElementById(sectionId) ||
                (sectionId === "menu" ? document.getElementById("food-display") : null) ||
                (sectionId === "contact" ? document.getElementById("footer") : null);

            if (el) {
                const navbarOffset = 85;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition =
                    elementPosition + window.pageYOffset - navbarOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            } else if (sectionId === "home") {
                scrollToTop();
            }
        } else {
            navigate(sectionId === "home" ? "/" : `/#${sectionId}`);
        }
    };

    const handleLogout = () => {
        logout();
        setShowProfile(false);
        scrollToTop();
        navigate("/");
    };

    return (
        <>
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
                    <a
                        href="/#home"
                        className={
                            menu === "home" && location.pathname === "/"
                                ? "active"
                                : ""
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("home", "home");
                        }}
                    >
                        Home
                    </a>

                    <a
                        href="/#food-display"
                        className={menu === "menu" ? "active" : ""}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("food-display", "menu");
                        }}
                    >
                        Menu
                    </a>

                    <a
                        href="/#app-download"
                        className={menu === "app" ? "active" : ""}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("app-download", "app");
                        }}
                    >
                        Mobile App
                    </a>

                    <a
                        href="/#footer"
                        className={
                            menu === "contact" || location.pathname === "/contact"
                                ? "active"
                                : ""
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("footer", "contact");
                        }}
                    >
                        Contact Us
                    </a>
                </ul>

                <div className="navbar-right">
                    <a
                        className="admin-access-link"
                        href={adminUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ShieldCheck size={16} aria-hidden="true" />
                        <span>Admin</span>
                    </a>
                    <div className="navbar-search-icon navbar-favorites">
                        <Link
                            to="/favorites"
                            aria-label={`Favorites${favoriteFoodIds.length ? `, ${favoriteFoodIds.length} saved` : ""}`}
                            title="Favorites"
                        >
                            <Heart className="lucide-icon" size={22} />
                        </Link>
                        {favoriteFoodIds.length > 0 && (
                            <span className="favorites-dot">
                                {favoriteFoodIds.length}
                            </span>
                        )}
                    </div>

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
                            onClick={() => navigate("/login")}
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

                                <li onClick={handleLogout}>
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