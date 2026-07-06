import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
    const handleCategory = (selectedCategory) => {
        setCategory(selectedCategory);

        setTimeout(() => {
            document
                .getElementById("food-display")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 100);
    };

    return (
        <section
            className="explore-menu"
            id="explore-menu"
        >
            <h2>Explore Our Menu</h2>

            <p className="explore-menu-text">
                Choose from a diverse menu featuring a delectable array
                of dishes. Our mission is to satisfy your cravings and
                elevate your dining experience, one delicious meal at a
                time.
            </p>

            <div className="explore-menu-header">
                <button
                    type="button"
                    className={`show-all-btn ${
                        category === "All" ? "active" : ""
                    }`}
                    onClick={() => handleCategory("All")}
                >
                    🍽 Show All
                </button>
            </div>

            <div className="explore-menu-list">
                {menu_list.map((item) => (
                    <div
                        key={item.menu_name}
                        className="explore-menu-list-item"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                            handleCategory(item.menu_name)
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" ||
                                e.key === " "
                            ) {
                                handleCategory(
                                    item.menu_name
                                );
                            }
                        }}
                    >
                        <img
                            src={item.menu_image}
                            alt={item.menu_name}
                            className={
                                category === item.menu_name
                                    ? "active"
                                    : ""
                            }
                        />

                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>

            <hr />
        </section>
    );
};

export default ExploreMenu;