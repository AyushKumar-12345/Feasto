import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Camera,
    Heart,
    Package,
    ShieldCheck,
    ShoppingBasket,
    Sparkles,
    Trash2,
    UserRound,
} from "lucide-react";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContextValue";
import "./Profile.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const Profile = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const {
        profileImage,
        setProfileImage,
        userName,
        token,
        favoriteFoodIds,
        cartItems,
    } = useContext(StoreContext);

    const cartItemCount = Object.values(cartItems).reduce(
        (total, quantity) => total + quantity,
        0
    );

    const saveProfileImage = (file) => {
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Choose a JPG, PNG, or WEBP image.");
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            toast.error("Choose an image smaller than 5 MB.");
            return;
        }

        setIsProcessingImage(true);
        const reader = new FileReader();
        reader.onerror = () => {
            setIsProcessingImage(false);
            toast.error("We couldn't read that image. Please try another.");
        };
        reader.onload = () => {
            const image = new Image();
            image.onerror = () => {
                setIsProcessingImage(false);
                toast.error("That file could not be opened as an image.");
            };
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const size = 320;
                canvas.width = size;
                canvas.height = size;
                const context = canvas.getContext("2d");

                if (!context) {
                    setIsProcessingImage(false);
                    toast.error("Image editing is not supported in this browser.");
                    return;
                }

                const scale = Math.max(size / image.width, size / image.height);
                const width = image.width * scale;
                const height = image.height * scale;
                context.drawImage(
                    image,
                    (size - width) / 2,
                    (size - height) / 2,
                    width,
                    height
                );
                setProfileImage(canvas.toDataURL("image/jpeg", 0.84));
                setIsProcessingImage(false);
                toast.success("Profile photo updated successfully!");
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    const removeProfileImage = () => {
        setProfileImage("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("Profile photo removed.");
    };

    if (!token) {
        return (
            <section className="profile-page">
                <button
                    type="button"
                    className="profile-back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={17} /> Back
                </button>
                <div className="profile-guest-card">
                    <span className="profile-guest-icon">
                        <UserRound size={32} />
                    </span>
                    <span className="profile-eyebrow">MY ACCOUNT</span>
                    <h1>Sign in to view your profile</h1>
                    <p>
                        Sign in to manage your photo, revisit saved favorites,
                        and track your deliveries in real-time.
                    </p>
                    <Link to="/login" className="profile-primary-btn">
                        Sign In <ArrowRight size={17} />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="profile-page">
            <button
                type="button"
                className="profile-back-button"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={17} /> Back
            </button>

            <header className="profile-welcome">
                <span className="profile-eyebrow">MY ACCOUNT</span>
                <h1>
                    Welcome back, <span>{userName || "Foodie"}</span>!
                </h1>
                <p>
                    Manage your profile photo, view saved favorite dishes, and track
                    your orders.
                </p>
            </header>

            <div className="profile-dashboard">
                {/* Clean, Simple Profile Card (No idiot background!) */}
                <section
                    className="profile-card"
                    aria-label="Profile photo and info"
                >
                    <div className="profile-avatar-wrapper">
                        <button
                            type="button"
                            className="profile-avatar-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title={
                                profileImage
                                    ? "Click to change photo"
                                    : "Click to upload photo"
                            }
                            aria-label="Profile photo"
                            disabled={isProcessingImage}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={`${userName || "User"} profile`}
                                    className="profile-avatar-img"
                                />
                            ) : (
                                <div className="profile-avatar-initial">
                                    {(userName || "U")
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}

                            <div className="profile-avatar-overlay">
                                <Camera size={22} />
                                <span>{profileImage ? "Change" : "Upload"}</span>
                            </div>
                        </button>
                        <span
                            className="profile-status-badge"
                            title="Active Account"
                        />
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        onChange={(event) => {
                            saveProfileImage(event.target.files?.[0]);
                            event.target.value = "";
                        }}
                    />

                    <div className="profile-info">
                        <span className="profile-customer-badge">
                            <Sparkles size={13} /> Feasto Customer
                        </span>
                        <h2>{userName || "Feasto Member"}</h2>
                        <p className="profile-hint">
                            Tap your photo or the button below to upload a picture.
                        </p>
                    </div>

                    <div className="profile-actions">
                        <button
                            className="profile-upload-btn"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessingImage}
                        >
                            <Camera size={16} />
                            {isProcessingImage
                                ? "Updating photo..."
                                : profileImage
                                ? "Change Photo"
                                : "Add Photo"}
                        </button>

                        {profileImage && (
                            <button
                                className="profile-remove-btn"
                                type="button"
                                onClick={removeProfileImage}
                                title="Remove photo"
                            >
                                <Trash2 size={15} /> Remove
                            </button>
                        )}
                    </div>

                    <div className="profile-privacy-note">
                        <ShieldCheck size={15} />
                        <span>Profile photo is stored locally in your browser.</span>
                    </div>
                </section>

                {/* Interactive Stat Cards */}
                <div
                    className="profile-stat-grid"
                    aria-label="Account shortcuts"
                >
                    <Link
                        to="/myorders"
                        className="profile-stat-card orders-card"
                    >
                        <div className="profile-stat-header">
                            <span className="profile-stat-icon orders">
                                <Package size={22} />
                            </span>
                            <ArrowRight
                                size={18}
                                className="profile-stat-arrow"
                            />
                        </div>
                        <span className="profile-stat-value">Track</span>
                        <span className="profile-stat-label">Your Orders</span>
                        <span className="profile-stat-sub">
                            Live tracking &amp; order history
                        </span>
                    </Link>

                    <Link
                        to="/favorites"
                        className="profile-stat-card favorites-card"
                    >
                        <div className="profile-stat-header">
                            <span className="profile-stat-icon favorites">
                                <Heart size={22} />
                            </span>
                            <ArrowRight
                                size={18}
                                className="profile-stat-arrow"
                            />
                        </div>
                        <span className="profile-stat-value">
                            {favoriteFoodIds.length}
                        </span>
                        <span className="profile-stat-label">
                            Saved Favorites
                        </span>
                        <span className="profile-stat-sub">
                            Dishes you love
                        </span>
                    </Link>

                    <Link
                        to="/cart"
                        className="profile-stat-card cart-card"
                    >
                        <div className="profile-stat-header">
                            <span className="profile-stat-icon cart">
                                <ShoppingBasket size={22} />
                            </span>
                            <ArrowRight
                                size={18}
                                className="profile-stat-arrow"
                            />
                        </div>
                        <span className="profile-stat-value">
                            {cartItemCount}
                        </span>
                        <span className="profile-stat-label">
                            Items in Cart
                        </span>
                        <span className="profile-stat-sub">
                            Ready for checkout
                        </span>
                    </Link>
                </div>
            </div>

            {/* Simple bottom banner to discover menu */}
            <section className="profile-banner">
                <div className="profile-banner-left">
                    <span className="profile-banner-icon">
                        <Sparkles size={20} />
                    </span>
                    <div>
                        <h3>Hungry for something delicious?</h3>
                        <p>Browse today's freshly prepared dishes and order now.</p>
                    </div>
                </div>
                <Link to="/#food-display" className="profile-menu-btn">
                    Explore Menu <ArrowRight size={16} />
                </Link>
            </section>
        </section>
    );
};

export default Profile;
