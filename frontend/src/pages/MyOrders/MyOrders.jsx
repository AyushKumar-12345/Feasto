import React, { useCallback, useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContextValue";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeliveryTrackingMap from "../../components/DeliveryTrackingMap/DeliveryTrackingMap";
import {
    Package,
    CircleCheckBig,
    CircleX,
    Clock3,
    Truck,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async (isRefresh = false) => {
        if (!token) {
            setOrders([]);
            setError("Please log in to view your orders.");
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError("");

            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success || !Array.isArray(response.data.data)) {
                throw new Error(
                    response.data.message || "Failed to load your orders."
                );
            }

            setOrders(response.data.data);
        } catch (requestError) {
            console.error(requestError);
            setError(
                requestError.response?.data?.message ||
                    requestError.message ||
                    "Failed to load your orders. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token, url]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateOrderTracking = useCallback((orderId, tracking) => {
        setOrders((previousOrders) =>
            previousOrders.map((order) =>
                order._id === orderId
                    ? {
                          ...order,
                          status: tracking.status,
                          trackingActive: tracking.trackingActive,
                          deliveryLocation: tracking.deliveryLocation,
                          riderLocation: tracking.riderLocation,
                          riderLocationUpdatedAt:
                              tracking.riderLocationUpdatedAt,
                      }
                    : order
            )
        );
    }, []);

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

            <div className="orders-heading-row">
                <h2>My Orders</h2>
                <button
                    type="button"
                    className={`orders-refresh-btn${refreshing ? " spinning" : ""}`}
                    onClick={() => fetchOrders(true)}
                    disabled={loading || refreshing || !token}
                    aria-label="Refresh all orders"
                >
                    <RefreshCw size={16} />
                    <span>{refreshing ? "Refreshing..." : "Refresh orders"}</span>
                </button>
            </div>

            {loading ? (
                <div className="orders-loading" role="status">
                    <p>Loading your orders...</p>
                </div>
            ) : !token ? (
                <div className="empty-orders">
                    <Package size={64} className="empty-orders-icon" />
                    <h3>Login Required</h3>
                    <p>{error}</p>
                    <button type="button" onClick={() => navigate("/")}>
                        Go to Home
                    </button>
                </div>
            ) : error && orders.length === 0 ? (
                <div className="orders-error" role="alert">
                    <p>{error}</p>
                    <button
                        type="button"
                        className="orders-retry-btn"
                        onClick={() => fetchOrders()}
                    >
                        Try again
                    </button>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-orders">
                    <Package size={64} className="empty-orders-icon" />
                    <h3>No Orders Yet</h3>
                    <p>You haven&apos;t placed any paid orders yet.</p>
                    <button type="button" onClick={() => navigate("/")}>
                        Order Food Now
                    </button>
                </div>
            ) : (
                <>
                    {error && (
                        <p className="orders-error" role="alert">
                            {error}
                        </p>
                    )}
                    <div className="container">
                        {orders.map((order) => {
                            const status = order.status || "Processing";
                            const showOrderStatus =
                                order.paymentStatus === "Paid" &&
                                status !== "Cancelled";
                            const items = Array.isArray(order.items)
                                ? order.items
                                : [];

                            return (
                                <div key={order._id} className="my-orders-order">
                                    <Package size={36} className="order-pack-icon" />

                                    <div className="order-details">
                                        <p className="order-food">
                                            {items
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
                                                <strong>Items:</strong> {items.length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="order-status-wrapper">
                                        <div
                                            className={`status-badge ${
                                                showOrderStatus
                                                    ? status
                                                          .toLowerCase()
                                                          .replace(/ /g, "-")
                                                    : "payment-failed"
                                            }`}
                                        >
                                            {!showOrderStatus ? (
                                                <CircleX size={15} />
                                            ) : status === "Delivered" ? (
                                                <CircleCheckBig size={15} />
                                            ) : status.toLowerCase().includes("delivery") ? (
                                                <Truck size={15} />
                                            ) : (
                                                <Clock3 size={15} />
                                            )}
                                            <span>
                                                {showOrderStatus
                                                    ? status
                                                    : order.status === "Cancelled"
                                                      ? "Cancelled"
                                                      : "Payment Failed"}
                                            </span>
                                        </div>
                                    </div>

                                    {showOrderStatus &&
                                        status === "Out for Delivery" && (
                                        <DeliveryTrackingMap
                                            orderId={order._id}
                                            url={url}
                                            token={token}
                                            onOrderUpdate={updateOrderTracking}
                                        />
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
};

export default MyOrders;
