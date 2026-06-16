import { normalizeToDate } from "./utils";

export function isLandscape() {
    return coin_detail.is_landscape;
    //return window.matchMedia("(orientation: landscape)").matches;
}

export function applyResponsiveChartOptions(chart) {
    chart.applyOptions({
        localization: {
            timeFormatter: (time) => {
                const d = normalizeToDate(time);
                if (isNaN(+d)) return "";
                return fmtInTz(d, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
            },
        },
        grid: {
            vertLines: { visible: false },
            horzLines: { visible: isLandscape(), color: "#EEEEEE" },
        },
        rightPriceScale: {
            scaleMargins: { top: 0.25, bottom: 0 },
            visible: isLandscape(),
            borderColor: "#EEEEEE",
        },
        handleScroll: isLandscape(),
        handleScale: isLandscape(),
    });
}
