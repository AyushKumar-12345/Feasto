import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const targetId = hash.replace("#", "");
            const scrollToElement = () => {
                const element =
                    document.getElementById(targetId) ||
                    (targetId === "menu" ? document.getElementById("food-display") : null) ||
                    (targetId === "contact" ? document.getElementById("footer") : null);

                if (element) {
                    const navbarOffset = 85;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition =
                        elementPosition + window.pageYOffset - navbarOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                    return true;
                }
                return false;
            };

            if (!scrollToElement()) {
                const timer = setTimeout(scrollToElement, 120);
                return () => clearTimeout(timer);
            }
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;