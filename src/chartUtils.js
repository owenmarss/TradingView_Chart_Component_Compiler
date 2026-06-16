import { normalizeToDate, formatDateTimeJakarta, fmtIDR } from "./utils";
import { createChart, ColorType } from "lightweight-charts";
import "./style.css";
import { createSeriesByType } from "./seriesCreator";
import { loadOhlc } from "./dataLoader";
import { isLandscape, applyResponsiveChartOptions } from "./responsive";
import { parseLocaleNumber } from "./coinDetail";

export class ChartUtils {
    constructor(container) {
        this.container = container;
    }
    async setUpSeries() {
        if (!this.selectedSeries) {
            return;
        }
        const data = await loadOhlc();
        this.selectedSeries.setData(data);

        this.storedData = {};

        data.forEach((x) => {
            this.storedData[x.time] = x;
        });

        this.chart.timeScale().fitContent(); // Adjusts the view to show all data
        this.selectedSeries.applyOptions({
            priceFormat: {
                type: "custom",
                formatter: fmtIDR,
            },
        });

        this.selectedSeries.priceScale().applyOptions({
            scaleMargins: {
                top: isLandscape() ? 0.465 : 0.45,
                bottom: isLandscape() ? 0.14 : 0.12,
            },
        });
    }

    switchChartByType(newType) {
        // no-op if same chart
        if (newType === this.selectedChartType && this.selectedSeries) return;

        this.selectedChartType = newType;

        if (this.selectedSeries) this.chart.removeSeries(this.selectedSeries);

        this.selectedSeries = createSeriesByType(
            this.chart,
            this.selectedChartType,
            getChgVal(),
        );
        this.setUpSeries();

        // optional: keep view nice after switching
        this.chart.timeScale().fitContent();
    }

    initialize() {
        this.chart = createChart(this.container, {
            layout: {
                fontFamily: "'Sora', sans-serif",
                background: {
                    type: ColorType.Solid, //
                    color: "transparent",
                },
                textColor: "#002731",
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.25,
                    bottom: 0,
                },
                visible: false,
            },
            timeScale: {
                visible: false,
                timeVisible: true,
                secondsVisible: false,
                fixLeftEdge: true,
                fixRightEdge: true
            },
            crosshair: {
                horzLine: {
                    visible: true,
                    labelVisible: false,
                },
                vertLine: {
                    labelVisible: true,
                },
            },
            handleScroll: true,
            handleScale: true,
        });
        const toolTipMargin = 15;

        const toolTip = document.createElement("div");
        toolTip.style = `
            width: fit-content;
            height: fit-content;
            position: absolute;
            display: none;
            box-sizing: border-box;
            text-align: left;
            z-index: 1000;
            pointer-events: none;
            border: 1px solid rgba(0,0,0,0.10);
            border-radius: 8px;
            background: white;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            padding: 12rem 24rem 14rem 16rem;
            filter: drop-shadow(0 9px 7px rgb(0 0 0 / 0.1))
        `;
        this.container.appendChild(toolTip);

        this.chart.subscribeCrosshairMove((param) => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.y < 0
            ) {
                toolTip.style.display = "none";
            } else {
                const dataFromPointer = param.seriesData.get(
                    this.selectedSeries,
                );

                const dt = normalizeToDate(param.time);
                const dateStrGMT = isNaN(+dt) ? "—" : formatDateTimeJakarta(dt);

                const data = this.storedData[dataFromPointer.time];
                if (!data) {
                    toolTip.style.display = "none";
                    return;
                }
                const openStr = data.open != null ? fmtIDR(data.open) : "-";
                const highStr = data.high != null ? fmtIDR(data.high) : "-";
                const lowStr = data.low != null ? fmtIDR(data.low) : "-";
                const closeStr = data.close != null ? fmtIDR(data.close) : "-";

                let dateComponent = `                    
                    <div style="font-weight: 400; font-size: 22rem; padding-bottom: 6rem; font-family: 'Darker Grotesque Medium', sans-serif">
                        ${dateStrGMT}
                    </div>`;

                if (!coin_detail.show_date) {
                    dateComponent = "";
                }

                toolTip.innerHTML = `

                    <div style="display: flex; align-items: center; padding-top: 2rem; padding-right: 0rem; padding-bottom: 4rem; font-family: 'Sora', sans-serif; width: 280rem">
                        <div style="font-size: 22rem; font-weight: 500; width: 35%;">
                            Open:
                        </div>
                        <div style="color: #0DA750; font-size: 24rem; font-weight: 600;">
                            ${openStr}
                        </div>
                    </div> 

                    <div style="display: flex; align-items: center; padding-right: 0rem; padding-bottom: 4rem; font-family: 'Sora', sans-serif; width: 280rem">
                        <div style="font-size: 22rem; font-weight: 500; width: 35%;">
                            High: 
                        </div>

                        <div style="color: #0DA750; font-size: 24rem; font-weight: 600;">
                            ${highStr}
                        </div>
                    </div> 

                    <div style="display: flex; align-items: center; padding-right: 0rem; padding-bottom: 4rem; font-family: 'Sora', sans-serif; width: 280rem">
                        <div style="font-size: 22rem; font-weight: 500; width: 35%;">
                            Low: 
                        </div>

                        <div style="color: #EF4444; font-size: 24rem; font-weight: 600;">
                            ${lowStr}
                        </div>
                    </div> 

                    <div style="display: flex; align-items: center; padding-right: 0rem; padding-bottom: 4rem; font-family: 'Sora', sans-serif; width: 280rem">
                        <div style="font-size: 22rem; font-weight: 500; width: 35%;">
                            Close: 
                        </div>

                        <div style="color: #EF4444; font-size: 24rem; font-weight: 600;">
                            ${closeStr}
                        </div>
                    </div> 

                    ${dateComponent}
                `;

                const tipW = toolTip.offsetWidth;
                const tipH = toolTip.offsetHeight;

                const x = param.point.x;
                const y = param.point.y;

                let left = x + toolTipMargin;
                let top = y + toolTipMargin;

                if (left + tipW > this.container.clientWidth) {
                    left = x - toolTipMargin - tipW;
                }
                if (top + tipH > this.container.clientHeight) {
                    top = y - toolTipMargin - tipH;
                }

                toolTip.style.left = left + "px";
                toolTip.style.top = top + "px";
                toolTip.style.display = "block";
            }
        });
        this.selectedSeries = createSeriesByType(
            this.chart,
            this.selectedChartType,
            getChgVal(),
        );

        this.onResize();
    }
    onResize() {
        this.chart.resize(
            this.container.clientWidth,
            this.container.clientHeight,
        );
        applyResponsiveChartOptions(this.chart);
        if (this.selectedSeries) this.setUpSeries();
        this.chart.timeScale().fitContent();
    }
}

function getChgVal() {
    if (typeof coin_detail === "undefined") return 0;

    const raw =
        coin_detail.change_mode === "7d"
            ? coin_detail.percent_change_7d
            : coin_detail.percent_change_24h;

    return parseLocaleNumber(raw || 0);
}
