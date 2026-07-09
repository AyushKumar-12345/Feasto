import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Package, Calendar, CreditCard, Hash } from "lucide-react";
import "./Orders.css";

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
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
    };

    const statusHandler = async (event, orderId) => {
        const newStatus = event.target.value;
        try {
            const token = localStorage.getItem("token");
            
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId
                        ? { 
                            ...order, 
                            status: newStatus,
                            payment: newStatus === "Delivered" ? true : order.payment
                          }
                        : order
                )
            );

            const response = await axios.post(
                `${url}/api/order/status`,
                {
                    orderId,
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
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
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const formatStatusClass = (status) => {
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
                                    <span className={`status-badge ${formatStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className={`payment-badge ${order.payment ? "paid" : "pending"}`}>
                                        {order.payment ? "Paid" : "Pending"}
                                    </span>
                                </div>
                            </div>

                            <div className="order-item-body">
                                <div className="order-icon-wrapper">
                                    <Package size={32} />
                                </div>

                                <div className="order-details">
                                    <p className="order-item-food">
                                        {order.items
                                            .map((item) => `${item.name} × ${item.quantity}`)
                                            .join(", ")}
                                    </p>

                                    <p className="order-item-name">
                                        {order.address.firstName} {order.address.lastName}
                                    </p>

                                    <div className="order-item-address">
                                        <p>{order.address.street},</p>
                                        <p>
                                            {order.address.city}, {order.address.state},{" "}
                                            {order.address.country}, {order.address.zipCode}
                                        </p>
                                    </div>

                                    <p className="order-item-phone">{order.address.phone}</p>
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
                                        <span>{order.items.length} {order.items.length === 1 ? "Item" : "Items"}</span>
                                        <strong>₹{order.amount}</strong>
                                    </div>
                                </div>

                                <div className="order-action-panel">
                                    <label>Order Status</label>
                                    <select
                                        value={order.status}
                                        onChange={(event) =>
                                            statusHandler(event, order._id)
                                        }
                                    >
                                        <option value="Food Processing">
                                            Food Processing
                                        </option>
                                        <option value="Out for delivery">
                                            Out for delivery
                                        </option>
                                        <option value="Delivered">
                                            Delivered
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;