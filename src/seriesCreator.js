import { AreaSeries, CandlestickSeries, BarSeries } from "lightweight-charts";
// ---------------------------
// Series creators
// ---------------------------
export function getAreaColors(chgVal) {
    return {
        lineColor: chgVal < 0 ? "#dc2626" : "#16a34a",
        topColor: chgVal < 0 ? "rgba(220,38,38,0.28)" : "rgba(22,163,74,0.28)",
    };
}

function addAreaSeries(chart, chgVal) {
    const { topColor, lineColor } = getAreaColors(chgVal);
    return chart.addSeries(AreaSeries, {
        topColor,
        bottomColor: "rgb(255, 255, 255)",
        lineColor,
        lineWidth: 1.5,
        crossHairMarkerVisible: false,
        priceLineVisible: false,
    });
}

function addCandleStickSeries(chart, chgVal) {
    chart.applyOptions({
        timeScale: {
            barSpacing: 0, // make candles more “packed”; adjust to taste
        },
    });

    return chart.addSeries(CandlestickSeries, {
        upColor: "#0DA750",
        downColor: "#EF4444",
        wickUpColor: "#A3A3A3",
        wickDownColor: "#A3A3A3",
        borderVisible: false,
        priceLineVisible: false,
    });
}

function addBarSeries(chart, chgVal) {
    return chart.addSeries(BarSeries, {
        upColor: "#0DA750",
        downColor: "#EF4444",
        priceLineVisible: false,
        thinBars: true,
    });
}

// Centralized “create series by idx” (THIS fixes your bug)
export function createSeriesByType(chart, chartType, chgVal) {
    const methodMap = {
        area: addAreaSeries,
        candlestick: addCandleStickSeries,
        bar: addBarSeries,
    };
    const f = methodMap[chartType];

    if (f) {
        return f(chart, chgVal);
    }
    return null;
}
