export async function loadOhlc() {
    hist.data.quotes.sort((a, b) => new Date(a.timeOpen) - new Date(b.timeOpen));
    try {
        const data = hist.data.quotes.map((x, idx) => ({
            time: Math.floor(new Date(x.timeOpen).getTime() / 1000),
            value: x.quote.close,
            close: x.quote.close,
            high: x.quote.high,
            low: x.quote.low,
            open: x.quote.open,
            idx,
        }));
        return data;
    } catch (error) {
        console.error("Failed to load ohlc data feed:", error);
        return Promise.reject("data is not loaded");
    }
}
