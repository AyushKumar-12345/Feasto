import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Login.css";

const Login = ({ url, setToken }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const onChangeHandler = ({ target: { name, value } }) => {
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(
                `${url}/api/admin/login`,
                {
                    email: data.email.trim(),
                    password: data.password,
                }
            );

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setToken(response.data.token);
                toast.success("Login Successful");
                navigate("/", { replace: true });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <form className="login-container" onSubmit={onSubmitHandler}>
                <h2>Feasto Admin</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Admin Email"
                    autoComplete="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={data.password}
                    onChange={onChangeHandler}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging In..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;