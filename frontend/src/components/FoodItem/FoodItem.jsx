import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
import { Plus, Minus, Star } from "lucide-react";

const FoodItem = ({
    id,
    name,
    price,
    description,
    image,
}) => {
    const {
        cartItems,
        addToCart,
        removeFromCart,
    } = useContext(StoreContext);

    const ratings = [
        4.1, 4.3, 4.5, 4.6, 4.7,
        4.8, 4.2, 4.4, 4.9, 4.0,
    ];

    const rating =
        ratings[
            id
                .split("")
                .reduce(
                    (sum, char) =>
                        sum + char.charCodeAt(0),
                    0
                ) % ratings.length
        ];

    return (
        <article
            id={`food-${id}`}
            className="food-item"
        >
            <div className="food-item-img-container">
                <img
                    className="food-item-img"
                    src={image}
                    alt={name}
                    loading="lazy"
                />

                {rating >= 4.8 && (
                    <span className="popular-badge">
                        🔥 Popular
                    </span>
                )}

                {!cartItems[id] ? (
                    <button
                        type="button"
                        className="add"
                        onClick={() => addToCart(id)}
                        aria-label="Add to cart"
                    >
                        <Plus size={18} />
                    </button>
                ) : (
                    <div className="food-item-counter">
                        <button
                            type="button"
                            onClick={() =>
                                removeFromCart(id)
                            }
                            aria-label="Decrease quantity"
                        >
                            <Minus size={18} />
                        </button>

                        <span>{cartItems[id]}</span>

                        <button
                            type="button"
                            onClick={() =>
                                addToCart(id)
                            }
                            aria-label="Increase quantity"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <h3>{name}</h3>

                    <div className="food-item-rating">
                        <Star
                            size={14}
                            fill="var(--primary)"
                            color="var(--primary)"
                        />
                        <span>{rating}</span>
                    </div>
                </div>

                <p className="food-item-description">
                    {description}
                </p>

                <p className="food-item-price">
                    ₹{price}
                </p>
            </div>
        </article>
    );
};

export default FoodItem;