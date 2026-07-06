import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import {
    Package,
    CircleCheckBig,
    Clock3,
    Truck,
} from "lucide-react";

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);

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
                <h2>My Orders</h2>
                <p>Loading your orders...</p>
            </section>
        );
    }

    return (
        <section className="my-orders">
            <h2>My Orders</h2>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <Package size={70} />
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="container">
                    {orders.map((order) => (
                        <div key={order._id} className="my-orders-order">
                            <Package size={42} color="tomato" />

                            <div className="order-details">
                                <p className="order-food">
                                    {order.items
                                        .map(
                                            (item) =>
                                                `${item.name} × ${item.quantity}`
                                        )
                                        .join(", ")}
                                </p>

                                <p>
                                    <strong>Total:</strong> ₹{order.amount}
                                </p>

                                <p>
                                    <strong>Items:</strong> {order.items.length}
                                </p>
                            </div>

                            <div className="order-status">
                                {order.status === "Delivered" ? (
                                    <CircleCheckBig size={18} color="green" />
                                ) : order.status === "Out for delivery" ? (
                                    <Truck size={18} color="tomato" />
                                ) : (
                                    <Clock3 size={18} color="#f59e0b" />
                                )}

                                <span>{order.status}</span>
                            </div>

                            <button type="button" onClick={fetchOrders}>
                                Refresh Status
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyOrders;