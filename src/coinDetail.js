import { fmtIDR, splitIDRPrice } from "./utils";
import "./style.css";
import { getAreaColors } from "./seriesCreator";
import { isLandscape } from "./responsive";
// ---------------------------
// Coin detail UI (and also re-color series on change)
// ---------------------------

export function parseLocaleNumber(value) {
    if (typeof value !== "string") return Number(value) || 0;
    return parseFloat(value.replace(",", "."));
}

export function applyCoinDetailStyling() {
    if (typeof coin_detail === "undefined") {
        console.error("coin_detail is not defined");
        return;
    }

    if (isLandscape()) {
        document.documentElement.classList.add("landscape");
    } else {
        document.documentElement.classList.remove("landscape");
    }

    const nameElement = document.querySelector(".coin-detail-name");
    const symbolElement = document.querySelector(".coin-detail-symbol");
    const priceElement = document.querySelector(".coin-detail-price-1");
    const priceElement2 = document.querySelector(".coin-detail-price-2"); // activate this

    const changeValueElement = document.querySelector(
        ".coin-detail-change-value",
    );
    const changePercentageElement = document.querySelector(
        ".coin-detail-change-percentage",
    );

    const imageElementContainer = document.querySelector(
        "#coin-detail-image-container",
    );
    const imageElement = document.querySelector(".coin-detail-image");

    if (nameElement) nameElement.textContent = coin_detail.name || "-";
    if (symbolElement) symbolElement.textContent = coin_detail.symbol || "-";
    // if (priceElement) priceElement.textContent = fmtIDR(coin_detail.price);

    switch (true) {
        // CASE 1 — SKR coin
        case coin_detail.transparent_coin === true && coin_detail.show_date === true: 
        {
            imageElementContainer.style.backgroundColor = "black";
            imageElementContainer.style.borderRadius = "100%";
            imageElementContainer.style.border = "none";
            imageElementContainer.style.overflow = "visible";
            break;
        }

        // CASE 2 — IDRQ coin
        case coin_detail.transparent_coin === false && coin_detail.show_date === false: 
        {
            imageElementContainer.style.backgroundColor = "transparent";
            imageElementContainer.style.borderRadius = "100%";
            imageElementContainer.style.overflow = "hidden";

            imageElement.style.objectFit = "contain";
            break;
        }

        // DEFAULT — transparent_coin === false && show_date === true
        default: {
            imageElementContainer.style.backgroundColor = "transparent";
            imageElementContainer.style.borderRadius = "0";
            imageElementContainer.style.border = "none";
            imageElementContainer.style.overflow = "visible";

            imageElement.style.objectFit = "";
            break;
        }
    }

    const { major, minor } = splitIDRPrice(
        coin_detail.price,
        coin_detail.price_precision,
    );

    if (priceElement) priceElement.textContent = major;
    if (priceElement2) priceElement2.textContent = minor;

    let valChange = 0.0;
    let pctChange = 0.0;

    switch (coin_detail.change_mode) {
        case "7d":
            valChange = parseFloat(coin_detail.value_change_7d || "0.00");
            pctChange = parseLocaleNumber(
                coin_detail.percent_change_7d || "0.00",
            );
            console.log("called 7d");
            break;
        case "24h":
        default:
            valChange = parseFloat(coin_detail.value_change_24h || "0.00");
            pctChange = parseLocaleNumber(
                coin_detail.percent_change_24h || "0.00",
            );
            console.log("called 24h");
            break;
    }

    if (changeValueElement)
        changeValueElement.textContent = `${fmtIDR(valChange)}`;
    if (changePercentageElement)
        changePercentageElement.textContent = `(${pctChange.toFixed(coin_detail.percent_precision)}%)`;

    const { lineColor } = getAreaColors(pctChange);

    // arrow color
    const changeSymbolElement = document.querySelector(
        `.coin-detail-change-symbol.${
            pctChange < 0 ? "arrow-down" : "arrow-up"
        }`,
    );

    if (changeSymbolElement) {
        changeSymbolElement.style.color = lineColor;
        changeSymbolElement.style.display = "inline-block";
    }
    if (changeValueElement) changeValueElement.style.color = lineColor;
    if (changePercentageElement) {
        changePercentageElement.style.color = lineColor;
        changePercentageElement.style.display = "inline-block";
    }

    if (imageElement && coin_detail.icon_url)
        imageElement.src = coin_detail.icon_url;
}
