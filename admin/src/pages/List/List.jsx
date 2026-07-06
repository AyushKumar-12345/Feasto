import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import "./List.css";

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchList = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${url}/api/food/list`);

            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch foods."
            );
        } finally {
            setLoading(false);
        }
    };

    const removeFood = async (foodId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this food item?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${url}/api/food/remove`,
                { id: foodId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);

                setList((prev) =>
                    prev.filter((item) => item._id !== foodId)
                );
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to remove food."
            );
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add">
            <h2 className="page-title">Food Menu</h2>

            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>

                {loading ? (
                    <div className="empty-list">
                        Loading food items...
                    </div>
                ) : list.length === 0 ? (
                    <div className="empty-list">
                        No food items available.
                    </div>
                ) : (
                    list.map((item) => (
                        <div
                            key={item._id}
                            className="list-table-format"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                            />

                            <p>{item.name}</p>

                            <p>{item.category}</p>

                            <p>₹{item.price}</p>

                            <button
                                type="button"
                                className="delete-btn"
                                title="Delete Food"
                                onClick={() =>
                                    removeFood(item._id)
                                }
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default List;