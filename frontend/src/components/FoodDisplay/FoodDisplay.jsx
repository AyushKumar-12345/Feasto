import React, { useContext, useMemo, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContextValue";
import FoodItem from "../FoodItem/FoodItem";
import { Search, SlidersHorizontal, X } from "lucide-react";

const normalizeSearchText = (value) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

const matchesSearch = (item, terms) => {
    if (terms.length === 0) return true;

    const searchableText = normalizeSearchText(
        [item.name, item.category].filter(Boolean).join(" ")
    );
    const searchableWords = searchableText.split(/\s+/);

    return terms.every((term) => {
        const normalizedTerm = ["dessert", "desserts"].includes(term) ? "deserts" : term;
        return searchableText.includes(normalizedTerm) ||
            searchableWords.some((word) => word.startsWith(normalizedTerm));
    });
};

const FoodDisplay = ({ selectedCategory, setSelectedCategory }) => {
    const { food_list, foodListSource } = useContext(StoreContext);
    const [query, setQuery] = useState("");
    const categories = useMemo(
        () => [...new Set(food_list.map((item) => item.category).filter(Boolean))],
        [food_list]
    );

    const searchTerms = useMemo(
        () => normalizeSearchText(query).split(/\s+/).filter(Boolean),
        [query]
    );
    const filteredFood = useMemo(
        () =>
            food_list.filter((item) =>
                (selectedCategory === "All" || selectedCategory === item.category) &&
                matchesSearch(item, searchTerms)
            ),
        [food_list, searchTerms, selectedCategory]
    );
    const hasActiveFilters = query.trim() !== "" || selectedCategory !== "All";

    const clearFilters = () => {
        setQuery("");
        setSelectedCategory("All");
    };

    return (
        <section
            className="food-display"
            id="food-display"
        >
            <span id="explore-menu" style={{ position: "relative", top: "-110px", display: "block", visibility: "hidden" }} />
            <div className="food-display-heading">
                <div>
                    <span className="food-display-eyebrow">THE MENU</span>
                    <h2>Find your next favourite.</h2>
                    <p>Good things are just a search or a tap away.</p>
                </div>
            </div>

            {foodListSource === "sample" && (
                <p className="food-menu-notice" role="status">
                    Showing 32 sample dishes while the menu service is unavailable.
                    Connect the backend to see its live menu and place orders.
                </p>
            )}

            <div className="food-discovery-bar">
                <form
                    className="food-search"
                    role="search"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <Search size={19} aria-hidden="true" />
                    <label className="food-search-label" htmlFor="food-search-input">
                        Search dishes and categories
                    </label>
                    <input
                        id="food-search-input"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by dish or category..."
                    />
                    {query && (
                        <button
                            type="button"
                            className="food-search-clear"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </form>
                <div className="food-filter-row" aria-label="Filter menu by category">
                    <span className="food-filter-label">
                        <SlidersHorizontal size={15} aria-hidden="true" />
                        Categories
                    </span>
                    <div className="food-filter-options">
                        {["All", ...categories].map((category) => {
                            const count = category === "All"
                                ? food_list.length
                                : food_list.filter((item) => item.category === category).length;

                            return (
                                <button
                                    type="button"
                                    key={category}
                                    className={`food-filter-chip${selectedCategory === category ? " is-active" : ""}`}
                                    aria-pressed={selectedCategory === category}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    <span className="food-filter-name">{category}</span>
                                    <span className="food-filter-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="food-results-toolbar" aria-live="polite">
                <p className="food-results-summary">
                    {foodListSource === "loading"
                        ? "Loading menu..."
                        : filteredFood.length === 0
                        ? "No dishes match your search."
                        : `Showing ${filteredFood.length} ${filteredFood.length === 1 ? "dish" : "dishes"}`}
                    {query.trim() && (
                        <span className="food-results-query"> for “{query.trim()}”</span>
                    )}
                    {selectedCategory !== "All" && (
                        <span className="food-results-category"> in {selectedCategory}</span>
                    )}
                </p>
                {hasActiveFilters && (
                    <button
                        type="button"
                        className="food-clear-filters"
                        onClick={clearFilters}
                    >
                        Clear filters
                        <X size={14} aria-hidden="true" />
                    </button>
                )}
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
                    <h3>
                        {foodListSource === "loading"
                            ? "Menu is loading"
                            : food_list.length === 0
                                ? "No dishes available"
                                : "No dishes found"}
                    </h3>
                    <p>
                        {foodListSource === "loading"
                            ? "Please wait while we connect to the menu."
                            : food_list.length === 0
                                ? "There are no dishes in the live menu yet. Please check back soon."
                                : "Try another category or clear your search to see more dishes."}
                    </p>
                    {food_list.length > 0 && (query || selectedCategory !== "All") && (
                        <button
                            type="button"
                            className="food-filter-reset"
                            onClick={clearFilters}
                        >
                            Show all dishes
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default FoodDisplay;