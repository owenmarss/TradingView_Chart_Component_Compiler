# TradingView Chart Component Compiler #

A single page application website hosting TradingView chart with datafeed from CoinMarketCap (CMC). Can be rendered as a webview component in mobile app (Android & iOS).

## Dependencies ##

* [lightweight-charts](https://www.npmjs.com/package/lightweight-charts)

## How do I get set up? ##

```
npm i          # install all development & runtime dependencies
npm run dev    # start the development server
npm run build  # build the minified production files
```

## How to use? ##

Populate the data using an endpoint structure from CoinMarketCap, example:
```
https://api.coinmarketcap.com/data-api/v3.1/cryptocurrency/historical?id=1831&timeStart=1756720644&interval=1h&convertId=2794
```
