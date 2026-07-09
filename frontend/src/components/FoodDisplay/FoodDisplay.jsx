import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";

import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    const filteredFood = food_list.filter(
        (item) =>
            category === "All" ||
            category === item.category
    );

    return (
        <section
            className="food-display"
            id="food-display"
        >
            <div className="food-display-header">
                <h2>Top Dishes Near You</h2>

                <span className="food-count">
                    {filteredFood.length}{" "}
                    {filteredFood.length === 1
                        ? "Dish"
                        : "Dishes"}
                </span>
            </div>

            {filteredFood.length > 0 ? (
                <div className="food-display-list">
                    {filteredFood.map((item) => (
                        <FoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            description={
                                item.description
                            }
                            price={item.price}
                            image={item.image}
                        />
                    ))}
                </div>
            ) : (
                <div className="food-display-empty">
                    <h3>No dishes found</h3>
                    <p>
                        We couldn't find any dishes in
                        this category right now.
                    </p>
                </div>
            )}
        </section>
    );
};

export default FoodDisplay;