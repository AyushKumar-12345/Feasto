import "./Header.css";
import { ArrowDownRight, Flame, Leaf, Sparkles } from "lucide-react";

const cravings = [
    {
        category: "Salad",
        label: "Fresh & light",
        description: "Bright, feel-good bites",
        icon: <Leaf size={19} aria-hidden="true" />,
    },
    {
        category: "Pasta",
        label: "Comfort mode",
        description: "A little extra cozy",
        icon: <Flame size={19} aria-hidden="true" />,
    },
    {
        category: "Deserts",
        label: "Sweet tooth",
        description: "Save room for joy",
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
                <span className="craving-kicker">A LITTLE JOY, DELIVERED</span>
                <h1 id="craving-title">
                    Good food.
                    <br />
                    <em>Better</em> moods.
                </h1>
                <p className="craving-description">
                    Whatever you’re in the mood for, there’s something delicious
                    waiting on the menu.
                </p>
                <a
                    className="craving-explore"
                    href="#food-display"
                    onClick={() => onChooseCategory("All")}
                >
                    Browse the menu
                    <ArrowDownRight size={18} aria-hidden="true" />
                </a>
            </div>

            <div className="craving-panel">
                <div className="craving-panel-heading">
                    <div>
                        <span className="craving-panel-eyebrow">TODAY’S MOOD</span>
                        <h2>What sounds good?</h2>
                    </div>
                    <Sparkles size={21} aria-hidden="true" />
                </div>

                <div className="craving-choices" aria-label="Filter menu by mood">
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
                <p className="craving-panel-hint">Choose a mood to filter the menu below.</p>
            </div>
        </section>
    );
};

export default Header;
