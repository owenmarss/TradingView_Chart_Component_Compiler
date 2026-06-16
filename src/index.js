// WATERMARK
import { ChartUtils } from "./chartUtils";
import { applyCoinDetailStyling } from "./coinDetail";
import { ChartTypeButtonSelection } from "./buttons";

const container = document.getElementById("chart-container");
const selector = document.getElementById("chart-mode-selector");
const bottomPanel = document.querySelector(".chart-bottom");
const htmlDom = document.documentElement
const body = document.body
function changeType(type) {
    chartUtils.switchChartByType(type);
    chartTypeButtonSelection.setActiveButton(type);
}

function handleResize() {
    container.style.width = htmlDom.clientWidth + "px";
    container.style.height = htmlDom.clientHeight + "px";
    chartUtils.onResize();
}

window.addEventListener("resize", handleResize);

const chartUtils = new ChartUtils(container);
const chartTypeButtonSelection = new ChartTypeButtonSelection(
    selector,
    (type) => changeType(type)
);
document.addEventListener('DOMContentLoaded', () => {
    chartUtils.initialize()

    handleResize()
    changeType(coin_detail.chart_type);

    if (!coin_detail.show_button_selection) {
        bottomPanel.style.display = "none";
    }
    applyCoinDetailStyling();


});
