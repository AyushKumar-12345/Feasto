import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Package,
    Calendar,
    CreditCard,
    Hash,
    RotateCw,
    MapPin,
    Square,
} from "lucide-react";
import "./Orders.css";

const nextOrderStatus = {
    "Food Processing": "Out for Delivery",
    "Out for Delivery": "Delivered",
};

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackingActionId, setTrackingActionId] = useState("");
    const trackingWatchId = useRef(null);
    const trackingOrderId = useRef("");
    const lastLocationSentAt = useRef(0);
    const locationErrorShown = useRef(false);

    const fetchAllOrders = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const response = await axios.get(
                `${url}/api/order/list`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch orders."
            );
        } finally {
            setLoading(false);
        }
    }, [url]);

    const statusHandler = useCallback(async (event, orderId) => {
        const newStatus = event.target.value;
        try {
            const token = localStorage.getItem("adminToken");
            
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              status: newStatus,
                              ...(newStatus !== "Out for Delivery"
                                  ? {
                                        trackingActive: false,
                                        riderLocation: null,
                                        riderLocationUpdatedAt: null,
                                    }
                                  : {}),
                          }
                        : order
                )
            );

            const response = await axios.post(
                `${url}/api/order/status`,
                { orderId, status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                if (
                    newStatus !== "Out for Delivery" &&
                    trackingOrderId.current === orderId
                ) {
                    navigator.geolocation.clearWatch(trackingWatchId.current);
                    trackingWatchId.current = null;
                    trackingOrderId.current = "";
                }
            } else {
                toast.error(response.data.message);
                fetchAllOrders();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update status."
            );
            fetchAllOrders();
        }
    }, [fetchAllOrders, url]);

    const sendLocation = useCallback(async (orderId, position, token) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const response = await axios.post(
            `${url}/api/order/tracking/location`,
            { orderId, latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Location update failed.");
        }

        setOrders((previousOrders) =>
            previousOrders.map((order) =>
                order._id === orderId
                    ? {
                          ...order,
                          trackingActive: true,
                          riderLocation: { latitude, longitude },
                          riderLocationUpdatedAt: new Date().toISOString(),
                      }
                    : order
            )
        );
    }, [url]);

    const startLocationSharing = useCallback(async (orderId) => {
        if (!navigator.geolocation) {
            toast.error("Location sharing is not supported by this browser.");
            return;
        }
        if (trackingOrderId.current && trackingOrderId.current !== orderId) {
            toast.info("Stop sharing the current delivery before starting another.");
            return;
        }

        setTrackingActionId(orderId);
        locationErrorShown.current = false;
        const token = localStorage.getItem("adminToken");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await axios.post(
                        `${url}/api/order/tracking/start`,
                        { orderId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (!response.data.success) {
                        throw new Error(
                            response.data.message || "Could not start tracking."
                        );
                    }

                    trackingOrderId.current = orderId;
                    await sendLocation(orderId, position, token);
                    lastLocationSentAt.current = Date.now();
                    trackingWatchId.current = navigator.geolocation.watchPosition(
                        async (nextPosition) => {
                            const now = Date.now();
                            if (now - lastLocationSentAt.current < 7000) return;
                            lastLocationSentAt.current = now;
                            try {
                                await sendLocation(orderId, nextPosition, token);
                            } catch (error) {
                                if (!locationErrorShown.current) {
                                    locationErrorShown.current = true;
                                    toast.error(
                                        error.response?.data?.message ||
                                            error.message ||
                                            "Could not update the rider location."
                                    );
                                }
                            }
                        },
                        (error) => {
                            if (!locationErrorShown.current) {
                                locationErrorShown.current = true;
                                toast.error(
                                    error.message ||
                                        "The browser could not read the rider location."
                                );
                            }
                        },
                        {
                            enableHighAccuracy: true,
                            maximumAge: 5000,
                            timeout: 15000,
                        }
                    );
                    toast.success("Live location sharing is on.");
                } catch (error) {
                    trackingOrderId.current = "";
                    toast.error(
                        error.response?.data?.message ||
                            error.message ||
                            "Could not start live location sharing."
                    );
                } finally {
                    setTrackingActionId("");
                }
            },
            (error) => {
                setTrackingActionId("");
                toast.error(
                    error.code === error.PERMISSION_DENIED
                        ? "Location permission was denied. Allow location access to share the rider's position."
                        : error.message || "Could not get the rider's location."
                );
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }, [sendLocation, url]);

    const stopLocationSharing = useCallback(async (orderId) => {
        const token = localStorage.getItem("adminToken");
        setTrackingActionId(orderId);
        if (trackingOrderId.current === orderId) {
            navigator.geolocation.clearWatch(trackingWatchId.current);
            trackingWatchId.current = null;
            trackingOrderId.current = "";
        }

        try {
            const response = await axios.post(
                `${url}/api/order/tracking/stop`,
                { orderId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!response.data.success) {
                throw new Error(response.data.message || "Could not stop tracking.");
            }
            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              trackingActive: false,
                              riderLocation: null,
                              riderLocationUpdatedAt: null,
                          }
                        : order
                )
            );
            toast.success("Live location sharing stopped.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Could not stop live location sharing."
            );
        } finally {
            setTrackingActionId("");
        }
    }, [url]);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    useEffect(() => () => {
        if (trackingWatchId.current !== null) {
            navigator.geolocation.clearWatch(trackingWatchId.current);
            const orderId = trackingOrderId.current;
            const token = localStorage.getItem("adminToken");
            void axios
                .post(
                    `${url}/api/order/tracking/stop`,
                    { orderId },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .catch((error) => console.error("Could not stop delivery tracking.", error));
        }
    }, [url]);

    const formatStatusClass = (status = "Unknown") => {
        return status.toLowerCase().replace(/\s+/g, "-");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="order">
            <div className="order-header-row">
                <h2 className="page-title">Customer Orders</h2>
                <button 
                    onClick={fetchAllOrders} 
                    disabled={loading}
                    className="order-refresh-btn"
                >
                    <RotateCw size={16} className={loading ? "refresh-icon-spin" : ""} />
                    Refresh
                </button>
            </div>

            <div className="order-list">
                {loading ? (
                    <div className="empty-orders">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="empty-orders">No orders available.</div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="order-item">
                            <div className="order-item-header">
                                <div className="order-id-block">
                                    <Hash size={16} />
                                    <span>ID: {order._id.substring(0, 8).toUpperCase()}</span>
                                </div>
                                <div className="order-meta-badges">
                                    {order.paymentStatus === "Paid" &&
                                    order.status !== "Cancelled" ? (
                                        <>
                                            <span className={`status-badge ${formatStatusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="payment-badge paid">
                                                Paid
                                            </span>
                                        </>
                                    ) : (
                                        <span className="payment-badge failed">
                                            {order.status === "Cancelled"
                                                ? "Cancelled"
                                                : "Payment Failed"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="order-item-body">
                                <div className="order-icon-wrapper">
                                    <Package size={32} />
                                </div>

                                <div className="order-details">
                                    <p className="order-item-food">
                                        {(Array.isArray(order.items) ? order.items : [])
                                            .map((item) => `${item.name} × ${item.quantity}`)
                                            .join(", ")}
                                    </p>
                                    <p className="order-item-name">
                                        {order.address?.firstName} {order.address?.lastName}
                                    </p>
                                    <div className="order-item-address">
                                        <p>{order.address?.street},</p>
                                        <p>
                                            {order.address?.city}, {order.address?.state},{" "}
                                            {order.address?.country}, {order.address?.zipCode}
                                        </p>
                                    </div>
                                    <p className="order-item-phone">{order.address?.phone}</p>
                                </div>

                                <div className="order-info-panel">
                                    <div className="info-row">
                                        <Calendar size={14} />
                                        <span>{formatDate(order.createdAt || order.date)}</span>
                                    </div>
                                    <div className="info-row">
                                        <CreditCard size={14} />
                                        <span>{order.paymentMethod || "Razorpay"}</span>
                                    </div>
                                    <div className="info-summary">
                                        <span>{Array.isArray(order.items) ? order.items.length : 0} {order.items?.length === 1 ? "Item" : "Items"}</span>
                                        <strong>₹{order.amount}</strong>
                                    </div>
                                </div>

                                {order.paymentStatus === "Paid" &&
                                    order.status !== "Cancelled" && (
                                    <div className="order-action-panel">
                                        <label>Order Status</label>
                                        <select
                                            value={order.status}
                                            onChange={(event) => statusHandler(event, order._id)}
                                            disabled={!nextOrderStatus[order.status]}
                                        >
                                            <option value={order.status}>{order.status}</option>
                                            {nextOrderStatus[order.status] && (
                                                <option value={nextOrderStatus[order.status]}>
                                                    {nextOrderStatus[order.status]}
                                                </option>
                                            )}
                                        </select>
                                        {order.status === "Out for Delivery" && (
                                            trackingOrderId.current === order._id ? (
                                                <button
                                                    type="button"
                                                    className="tracking-control stop-tracking"
                                                    onClick={() => stopLocationSharing(order._id)}
                                                    disabled={trackingActionId === order._id}
                                                >
                                                    <Square size={15} />
                                                    Stop sharing
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="tracking-control"
                                                    onClick={() => startLocationSharing(order._id)}
                                                    disabled={Boolean(trackingActionId)}
                                                >
                                                    <MapPin size={15} />
                                                    {trackingActionId === order._id
                                                        ? "Starting..."
                                                        : order.trackingActive
                                                          ? "Resume GPS sharing"
                                                          : "Start GPS sharing"}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;