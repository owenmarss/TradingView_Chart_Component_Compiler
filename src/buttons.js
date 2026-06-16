export class ChartTypeButtonSelection {
    setActiveButton(type) {
        this.modeButtons.forEach((btn) => {
            const isActive = btn.dataset.type === type;
            btn.classList.toggle("active", isActive);

            // swap icon to active/inactive based on type
            // (assumes your assets exist like: area-icon-active.png etc)
            const t = btn.dataset.type;

            switch (t) {
                case "area":
                    btn.src = isActive
                        ? "/public/icons/area-icon-active.png"
                        : "/public/icons/area-icon-inactive.png";
                    break;
                case "candlestick":
                    btn.src = isActive
                        ? "/public/icons/candlestick-icon-active.png"
                        : "/public/icons/candlestick-icon-inactive.png";
                    break;
                case "bar":
                    btn.src = isActive
                        ? "/public/icons/bar-icon-active.png"
                        : "/public/icons/bar-icon-inactive.png";
            }
        });
    }
    constructor(selector, onChange) {
        this.modeButtons = selector
            ? selector.querySelectorAll(".mode-btn")
            : [];

        // attach click listeners
        this.modeButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const type = btn.dataset.type;
                onChange(type);
            });
        });
    }
}
