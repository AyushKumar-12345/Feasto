import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
    const {
        getTotalCartAmount,
        token,
        food_list,
        cartItems,
        url,
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
    });

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const total = subtotal + deliveryFee;

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const initPay = (orderData, dbOrderId) => {
        if (!window.Razorpay) {
            toast.error("Razorpay SDK failed to load.");
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Feasto",
            description: "Secure Food Order Payment",
            image: "/logo.png",
            order_id: orderData.id,
            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phone,
            },
            notes: {
                address: data.street,
            },
            theme: {
                color: "#ff6347",
            },
            handler: async (response) => {
                navigate(
                    `/verify?success=true&orderId=${dbOrderId}&razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`
                );
            },
            modal: {
                ondismiss: () => {
                    navigate(
                        `/verify?success=false&orderId=${dbOrderId}`
                    );
                },
            },
        };

        new window.Razorpay(options).open();
    };

    const placeOrder = async (event) => {
        event.preventDefault();

        const orderItems = food_list
            .filter((item) => cartItems[item._id] > 0)
            .map((item) => ({
                ...item,
                quantity: cartItems[item._id],
            }));

        if (orderItems.length === 0) {
            return toast.error("Your cart is empty.");
        }

        const orderData = {
            address: data,
            items: orderItems,
            amount: total,
        };

        try {
            setLoading(true);

            const response = await axios.post(
                `${url}/api/order/place`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                initPay(response.data.order, response.data.orderId);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || subtotal === 0) {
            navigate("/cart");
        }
    }, [token, subtotal, navigate]);

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <h2 className="title">Delivery Information</h2>

                <div className="multi-fields">
                    <input
                        required
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={data.firstName}
                        onChange={onChangeHandler}
                        disabled={loading}
                    />
                    <input
                        required
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={data.lastName}
                        onChange={onChangeHandler}
                        disabled={loading}
                    />
                </div>

                <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={data.email}
                    onChange={onChangeHandler}
                    disabled={loading}
                />

                <input
                    required
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={data.street}
                    onChange={onChangeHandler}
                    disabled={loading}
                />

                <div className="multi-fields">
                    <input
                        required
                        type="text"
                        name="city"
                        placeholder="City"
                        value={data.city}
                        onChange={onChangeHandler}
                        disabled={loading}
                    />
                    <input
                        required
                        type="text"
                        name="state"
                        placeholder="State"
                        value={data.state}
                        onChange={onChangeHandler}
                        disabled={loading}
                    />
                </div>

                <div className="multi-fields">
                    <input
                        required
                        type="text"
                        name="zipCode"
                        placeholder="Zip Code"
                        value={data.zipCode}
                        onChange={onChangeHandler}
                        disabled={loading}
                    />
                    <input
                        required
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={data.country}
                        onChange={onChangeHandler}
                        disabled={loading}
                    />
                </div>

                <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={data.phone}
                    onChange={onChangeHandler}
                    disabled={loading}
                />
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Order Summary</h2>

                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>₹{subtotal}</p>
                        </div>

                        <hr />

                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>₹{deliveryFee}</p>
                        </div>

                        <hr />

                        <div className="cart-total-details">
                            <strong>Total</strong>
                            <strong>₹{total}</strong>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Processing Payment..."
                            : "Proceed to Payment"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;