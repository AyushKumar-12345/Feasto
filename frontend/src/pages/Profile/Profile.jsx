import React, { useContext, useRef } from "react";
import "./Profile.css";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Profile = () => {
    const fileInputRef = useRef(null);

    const { profileImage, setProfileImage } = useContext(StoreContext);

    const resizeImage = (file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");

                const size = 250;

                canvas.width = size;
                canvas.height = size;

                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    toast.error("Canvas not supported");
                    return;
                }

                ctx.drawImage(img, 0, 0, size, size);

                const compressed = canvas.toDataURL("image/jpeg", 0.8);

                setProfileImage(compressed);

                toast.success("Profile picture updated!");
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    };

    return (
        <section className="profile-page">
            <div className="profile-card">
                <div className="profile-avatar-wrapper">
                    <div
                        className="profile-avatar"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" />
                        ) : (
                            <Camera size={55} />
                        )}
                    </div>

                    <button
                        className="camera-btn"
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        title="Change Photo"
                    >
                        <Camera size={18} />
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            resizeImage(e.target.files[0]);
                        }
                    }}
                />

                <h2>Ayush Kumar</h2>

                <p>
                    Welcome to your Feasto profile. Upload a profile picture
                    to personalize your account.
                </p>

                <button
                    className="upload-btn"
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                >
                    {profileImage ? "Change Photo" : "Upload Photo"}
                </button>

                {profileImage && (
                    <button
                        className="delete-btn"
                        type="button"
                        onClick={() => {
                            setProfileImage("");
                            toast.success("Profile picture removed.");
                        }}
                    >
                        <Trash2 size={18} />
                        Delete Photo
                    </button>
                )}
            </div>
        </section>
    );
};

export default Profile;