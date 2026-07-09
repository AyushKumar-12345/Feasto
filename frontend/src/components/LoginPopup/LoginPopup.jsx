import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const [currState, setCurrState] = useState("Login");
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        setData({
            name: "",
            email: "",
            password: "",
        });
    }, [currState]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNavigation = (path) => {
        setShowLogin(false);
        navigate(path);
    };

    const onLogin = async (event) => {
        event.preventDefault();

        if (loading) return;

        const newUrl =
            currState === "Login"
                ? `${url}/api/user/login`
                : `${url}/api/user/register`;

        try {
            setLoading(true);

            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );

                setToken(response.data.token);

                toast.success(
                    currState === "Login"
                        ? "Login Successful"
                        : "Account Created Successfully"
                );

                setShowLogin(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-popup">
            <form
                className="login-popup-container"
                onSubmit={onLogin}
            >
                <div className="login-popup-title">
                    <h2>{currState}</h2>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={() =>
                            setShowLogin(false)
                        }
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="login-popup-inputs">
                    {currState !== "Login" && (
                        <input
                            autoFocus
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={data.name}
                            onChange={onChangeHandler}
                            disabled={loading}
                            required
                        />
                    )}

                    <input
                        autoFocus={
                            currState === "Login"
                        }
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={data.email}
                        onChange={onChangeHandler}
                        disabled={loading}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={onChangeHandler}
                        disabled={loading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Please Wait..."
                        : currState === "Login"
                        ? "Login"
                        : "Create Account"}
                </button>

                <div className="login-popup-condition">
                    <input
                        type="checkbox"
                        required
                        disabled={loading}
                    />

                    <p>
                        By continuing, I agree to the{" "}
                        <span
                            className="popup-link"
                            onClick={() =>
                                toast.info(
                                    "Terms of Use page is coming soon! 🚀"
                                )
                            }
                        >
                            Terms of Use
                        </span>{" "}
                        and{" "}
                        <span
                            className="popup-link"
                            onClick={() => handleNavigation("/privacy")}
                        >
                            Privacy Policy
                        </span>
                        .
                    </p>
                </div>

                {currState === "Login" ? (
                    <p>
                        Create a new account?{" "}
                        <span
                            onClick={() =>
                                setCurrState("Sign Up")
                            }
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have an account?{" "}
                        <span
                            onClick={() =>
                                setCurrState("Login")
                            }
                        >
                            Login here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;