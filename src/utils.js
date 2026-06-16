export function normalizeToDate(lightweightTime) {
    if (typeof lightweightTime === "number")
        return new Date(lightweightTime * 1000);

    if (typeof lightweightTime === "string")
        return new Date(lightweightTime + "T00:00:00Z");

    if (
        lightweightTime &&
        typeof lightweightTime === "object" &&
        "year" in lightweightTime
    ) {
        const { year, month, day } = lightweightTime;
        // return new Date(year, month ?? 1, day ?? 1);

        return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
    }

    return new Date(NaN);
}

export function formatDateTimeJakarta(d) {
    if (!(d instanceof Date) || isNaN(+d)) return "—";

    const tz = "Asia/Jakarta";

    const datePart = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(d);

    const timePart = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(d);

    return `${datePart}, ${timePart} GMT+7`;
}

export function formatDateTimeUTC(d) {
    if (!(d instanceof Date) || isNaN(+d)) return "—";

    const date = d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const time = d.toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${date} / ${time} / UTC`;
}

export function splitIDRPrice(value, precision) {
    if (value == null || isNaN(value)) {
        return { major: "Rp—", minor: "" };
    }

    // const precision = coin_detail.precision

    // Fixed decimal string (ensures trailing zeros)
    const fixed = Number(value).toFixed(precision);
    const [intPart, decPart] = fixed.split(".");

    // Format integer part as IDR
    const formattedInt = Number(intPart).toLocaleString("id-ID");

    return {
        major: `Rp${formattedInt}`,
        minor: decPart ? `,${decPart}` : "",
    };
}

export function fmtIDR(v) {
    return (
        "Rp" +
        Number(v).toLocaleString(coin_detail.lang == "en" ? "en-US" : "id-ID", {
            maximumFractionDigits:
                coin_detail.price_precision ?? (coin_detail.price >= 1 ? 2 : 8),
        })
    );
}
