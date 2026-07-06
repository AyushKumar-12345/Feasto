import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import "./SearchPopup.css";
import { StoreContext } from "../../context/StoreContext";
import { Search, X } from "lucide-react";

const SearchPopup = ({ setShowSearch }) => {
    const { food_list } = useContext(StoreContext);

    const [query, setQuery] = useState("");

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowSearch(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setShowSearch]);

    const filteredFood = useMemo(() => {
        const search = query.trim().toLowerCase();

        if (!search) return [];

        return food_list.filter((item) =>
            item.name.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search)
        );
    }, [food_list, query]);

    const selectFood = (id) => {
        setShowSearch(false);

        setTimeout(() => {
            const element = document.getElementById(`food-${id}`);

            if (element) {
                element.classList.remove("search-highlight");

                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                requestAnimationFrame(() => {
                    element.classList.add("search-highlight");
                });

                setTimeout(() => {
                    element.classList.remove("search-highlight");
                }, 1500);
            }
        }, 200);
    };

    return (
        <div
            className="search-popup"
            onClick={() => setShowSearch(false)}
        >
            <div
                className="search-popup-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="search-header">
                    <Search size={22} />

                    <input
                        autoFocus
                        type="text"
                        placeholder="Search food, category..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={() => setShowSearch(false)}
                        aria-label="Close Search"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="search-results">
                    {query.trim() === "" ? (
                        <p className="search-message">
                            Start typing to search food...
                        </p>
                    ) : filteredFood.length === 0 ? (
                        <p className="search-message">
                            No matching food found.
                        </p>
                    ) : (
                        filteredFood.map((item) => (
                            <div
                                key={item._id}
                                className="search-item"
                                onClick={() => selectFood(item._id)}
                            >
                                <img src={item.image} alt={item.name} />

                                <div>
                                    <h4>{item.name}</h4>
                                    <p>{item.category}</p>
                                    <strong>₹{item.price}</strong>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPopup;