import React, { useContext } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContextValue";
import FoodItem from "../../components/FoodItem/FoodItem";
import "./Favorites.css";

const Favorites = () => {
    const { favoriteFoodIds, food_list } = useContext(StoreContext);
    const favoriteFoods = food_list.filter((item) =>
        favoriteFoodIds.includes(item._id)
    );

    return (
        <section className="favorites-page">
            <header className="favorites-header">
                <span className="favorites-eyebrow">YOUR PERSONAL COLLECTION</span>
                <h1>Favorites</h1>
                <p>Your most-loved dishes, all in one place.</p>
            </header>

            {favoriteFoods.length > 0 ? (
                <>
                    <div className="favorites-count">
                        {favoriteFoods.length}{" "}
                        {favoriteFoods.length === 1 ? "dish" : "dishes"}
                    </div>
                    <div className="favorites-list">
                        {favoriteFoods.map((item) => (
                            <FoodItem
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="favorites-empty">
                    <div className="favorites-empty-icon">
                        <Heart size={30} />
                    </div>
                    <h2>No favorites yet</h2>
                    <p>
                        Tap the heart on any dish you love, and it will be saved
                        here for next time.
                    </p>
                    <Link to="/">Explore the menu</Link>
                </div>
            )}
        </section>
    );
};

export default Favorites;
