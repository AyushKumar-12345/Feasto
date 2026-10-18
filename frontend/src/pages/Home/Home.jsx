import React, { useState } from "react";
import "./Home.css";

import Header from "../../components/Header/Header";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const chooseCategory = (category) => {
        setSelectedCategory(category);
        document.getElementById("food-display")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="home" id="home-main-view">
            <Header
                selectedCategory={selectedCategory}
                onChooseCategory={chooseCategory}
            />
            <FoodDisplay
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <AppDownload />
        </div>
    );
};

export default Home;