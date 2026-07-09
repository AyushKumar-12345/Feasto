import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Package,
    CircleCheckBig,
    Clock3,
    Truck,
    ArrowLeft,
    RefreshCw
} from "lucide-react";

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    if (loading) {
        return (
            <section className="my-orders">
                <div className="orders-navigation-header">
                    <button 
                        type="button" 
                        className="back-nav-btn" 
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>
                </div>
                <h2>My Orders</h2>
                <div className="orders-loading">
                    <p>Loading your orders...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="my-orders">
            <div className="orders-navigation-header">
                <button 
                    type="button" 
                    className="back-nav-btn" 
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
            </div>

            <h2>My Orders</h2>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <Package size={64} className="empty-orders-icon" />
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet.</p>
                    <button type="button" onClick={() => navigate("/")}>
                        Order Food Now
                    </button>
                </div>
            ) : (
                <div className="container">
                    {orders.map((order) => (
                        <div key={order._id} className="my-orders-order">
                            <Package size={36} className="order-pack-icon" />

                            <div className="order-details">
                                <p className="order-food">
                                    {order.items
                                        .map(
                                            (item) =>
                                                `${item.name} × ${item.quantity}`
                                        )
                                        .join(", ")}
                                </p>

                                <div className="order-meta-info">
                                    <p>
                                        <strong>Total:</strong> ₹{order.amount}
                                    </p>
                                    <p>
                                        <strong>Items:</strong> {order.items.length}
                                    </p>
                                </div>
                            </div>

                            <div className="order-status-wrapper">
                                <div className={`status-badge ${order.status.toLowerCase().replace(/ /g, "-")}`}>
                                    {order.status === "Delivered" ? (
                                        <CircleCheckBig size={15} />
                                    ) : order.status === "Out for delivery" ? (
                                        <Truck size={15} />
                                    ) : (
                                        <Clock3 size={15} />
                                    )}
                                    <span>{order.status}</span>
                                </div>

                                <button 
                                    type="button" 
                                    className={`refresh-status-btn ${refreshing ? "spinning" : ""}`}
                                    onClick={() => fetchOrders(true)}
                                    disabled={refreshing}
                                    aria-label="Refresh Status"
                                >
                                    <RefreshCw size={14} />
                                    <span>Track</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyOrders;