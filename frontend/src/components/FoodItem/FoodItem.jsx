import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContextValue";
import { Heart, Plus, Minus, Star } from "lucide-react";
import { food_list as sampleFoodList } from "../../assets/assets";

const FoodItem = ({
    id,
    name,
    price,
    description,
    image,
}) => {
    const {
        cartItems,
        favoriteFoodIds,
        toggleFavorite,
        addToCart,
        removeFromCart,
    } = useContext(StoreContext);
    const isFavorite = favoriteFoodIds.includes(id);
    const [failedImageSource, setFailedImageSource] = useState("");
    const matchingSample = sampleFoodList.find((item) => item._id === id);
    const fallbackIndex = Array.from(String(id ?? name ?? "")).reduce(
        (sum, character) => sum + character.charCodeAt(0),
        0
    ) % sampleFoodList.length;
    const fallbackImage = matchingSample?.image || sampleFoodList[fallbackIndex]?.image;
    const imageSource = image || fallbackImage;
    const displayedImage =
        failedImageSource === imageSource ? fallbackImage : imageSource;

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
                    src={displayedImage}
                    alt={name}
                    loading="lazy"
                    onError={() => {
                        if (displayedImage !== fallbackImage) {
                            setFailedImageSource(imageSource);
                        }
                    }}
                />

                {rating >= 4.8 && (
                    <span className="popular-badge">
                        🔥 Popular
                    </span>
                )}

                <button
                    type="button"
                    className={`food-favorite-button${isFavorite ? " is-favorite" : ""}`}
                    onClick={() => toggleFavorite(id)}
                    aria-label={`${isFavorite ? "Remove" : "Add"} ${name} ${isFavorite ? "from" : "to"} favorites`}
                    aria-pressed={isFavorite}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
                </button>

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