import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ImagePlus } from "lucide-react";
import "./Add.css";

const categories = [
    "Salad",
    "Rolls",
    "Deserts",
    "Sandwich",
    "Cake",
    "Pure Veg",
    "Pasta",
    "Noodles",
];

const Add = ({ url }) => {
    const fileInputRef = useRef(null);

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
    });

    const onChangeHandler = ({ target: { name, value } }) => {
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            return toast.error("Please upload an image.");
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("description", data.description.trim());
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("image", image);

            const response = await axios.post(
                `${url}/api/food/add`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad",
                });
                removeImage();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add">
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Food Image</p>
                    <label htmlFor="food-image" className="upload-card">
                        {image ? (
                            <>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="remove-preview"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        removeImage();
                                    }}
                                >
                                    &times;
                                </button>
                            </>
                        ) : (
                            <>
                                <ImagePlus size={44} />
                                <h4>Choose Image</h4>
                                <span>PNG, JPG or WEBP</span>
                            </>
                        )}
                    </label>
                    <input
                        id="food-image"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) =>
                            setImage(event.target.files[0] || null)
                        }
                    />
                </div>

                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={onChangeHandler}
                        placeholder="Type here"
                        required
                    />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea
                        rows="6"
                        name="description"
                        value={data.description}
                        onChange={onChangeHandler}
                        placeholder="Write content here"
                        required
                    />
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category</p>
                        <select
                            name="category"
                            value={data.category}
                            onChange={onChangeHandler}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="add-price flex-col">
                        <p>Product Price</p>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            name="price"
                            value={data.price}
                            onChange={onChangeHandler}
                            placeholder="₹200"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="add-btn" disabled={loading}>
                    {loading ? "ADDING..." : "ADD FOOD"}
                </button>
            </form>
        </div>
    );
};

export default Add;