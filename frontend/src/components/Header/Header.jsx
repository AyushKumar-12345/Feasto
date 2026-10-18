import "./Header.css";
import { ArrowDownRight, Leaf, Sparkles, Utensils } from "lucide-react";

const cravings = [
    {
        category: "Salad",
        label: "Fresh & Crisp",
        description: "Garden salads & wholesome bowls",
        icon: <Leaf size={19} aria-hidden="true" />,
    },
    {
        category: "Pasta",
        label: "Savory & Hearty",
        description: "Classic pastas & comforting meals",
        icon: <Utensils size={19} aria-hidden="true" />,
    },
    {
        category: "Deserts",
        label: "Sweet Treats",
        description: "Delightful desserts, cakes & pastries",
        icon: <Sparkles size={19} aria-hidden="true" />,
    },
];

const Header = ({ selectedCategory, onChooseCategory }) => {
    const activeCraving = cravings.some(
        ({ category }) => category === selectedCategory
    )
        ? selectedCategory
        : "";
    const chooseCraving = (category) => {
        onChooseCategory(category);
    };

    return (
        <section className="header" id="home" aria-labelledby="craving-title">
            <div className="craving-copy">
                <span className="craving-kicker">FRESH & DELICIOUS</span>
                <h1 id="craving-title">
                    Delicious food.
                    <br />
                    <em>Delivered</em> fast.
                </h1>
                <p className="craving-description">
                    Explore a curated menu of chef-crafted dishes, wholesome
                    meals, and everyday favorites delivered right to your door.
                </p>
                <a
                    className="craving-explore"
                    href="#food-display"
                    onClick={() => onChooseCategory("All")}
                >
                    Explore the menu
                    <ArrowDownRight size={18} aria-hidden="true" />
                </a>
            </div>

            <div className="craving-panel">
                <div className="craving-panel-heading">
                    <div>
                        <span className="craving-panel-eyebrow">QUICK PICKS</span>
                        <h2>What would you like today?</h2>
                    </div>
                    <Sparkles size={21} aria-hidden="true" />
                </div>

                <div className="craving-choices" aria-label="Filter menu by category">
                    {cravings.map(({ category, label, description, icon }) => (
                        <button
                            type="button"
                            key={category}
                            className={`craving-choice${activeCraving === category ? " is-active" : ""}`}
                            aria-pressed={activeCraving === category}
                            onClick={() => chooseCraving(category)}
                        >
                            <span className="craving-choice-icon">{icon}</span>
                            <span className="craving-choice-copy">
                                <span className="craving-choice-label">{label}</span>
                                <span className="craving-choice-description">{description}</span>
                            </span>
                            <ArrowDownRight className="craving-choice-arrow" size={17} aria-hidden="true" />
                        </button>
                    ))}
                </div>
                <p className="craving-panel-hint">Select a category to filter the menu below.</p>
            </div>
        </section>
    );
};

export default Header;
