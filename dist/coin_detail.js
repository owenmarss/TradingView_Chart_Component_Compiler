const coin_detail = {
    "name": "IDRQ",
    "symbol": "IDRQ",
    "price": 1,

    // 24h
    "value_change_24h": 0,
    "percent_change_24h": "0", // Must be string❕ 

    // 7d
    "value_change_7d": 5133,
    "percent_change_7d": "0.23", // Must be string❕ 

    // Change mode "7d" || "24h"
    "change_mode": "24h", // Must be string❕ By default already 24h

    // object to decide the decimals for price
    "price_precision": 2,

    // object to decide the decimals for percent
    "percent_precision": 2,


    "icon_url": "https://s2.coinmarketcap.com/static/img/coins/64x64/36573.png",

    "lang": "id",
    "chart_type": "area",
    "is_landscape": true,
    "show_button_selection": true,

    // For SKR, if not SKR then false (default is false)
    "transparent_coin": false,

    // For IDRQ, if not IDRQ then false (default is TRUE)
    "show_date": false
}
