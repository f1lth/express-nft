"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenData = exports.getAllData = exports.getEthPriceToday = exports.getAllTokens = exports.getTokenSales = exports.getCurrentOwner = exports.getFloorPriceOverTime = void 0;
require('dotenv').config();
const { TRANSPOSE_API_KEY } = process.env;
const MILADY_CONTRACT = "0x5af0d9827e0c53e4799bb226655a1de152a425a5";
/*
    * Get the raw floor prices for each day
    * @return {Object} data
**/
function getFloorPriceOverTime() {
    return new Promise((resolve, reject) => {
        const https = require('https');
        var postData = JSON.stringify({
            sql: `SELECT timestamp::date AS date, percentile_disc(0.2) WITHIN GROUP (ORDER BY usd_price) AS floor_price FROM ethereum.nft_sales AS sales  WHERE sales.contract_address = '${MILADY_CONTRACT}' GROUP BY date HAVING COUNT(*) > 0;`
        });
        var options = {
            hostname: 'api.transpose.io',
            path: '/sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'X-API-KEY': TRANSPOSE_API_KEY
            }
        };
        var req = https.request(options, (res) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.write(postData);
        req.end();
    });
}
exports.getFloorPriceOverTime = getFloorPriceOverTime;
;
/*
    * Get the current owner of the token given a token ID
    * @param {String} tokenId
    * @return {Object} data
**/
function getCurrentOwner(tokenId) {
    return new Promise((resolve, reject) => {
        const https = require('https');
        const querystring = require('querystring');
        const params = {
            chain_id: "ethereum",
            contract_address: MILADY_CONTRACT,
            token_id: tokenId,
        };
        var options = {
            hostname: 'api.transpose.io',
            path: '/nft/owners-by-token-id?' + querystring.stringify(params),
            method: 'GET',
            headers: {
                'X-API-KEY': TRANSPOSE_API_KEY
            }
        };
        var req = https.request(options, (res) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}
exports.getCurrentOwner = getCurrentOwner;
;
/*
    * Get the sales history for the token given a token ID
    * @param {String} tokenId
    * @return {Object} data
**/
function getTokenSales(tokenId) {
    return new Promise((resolve, reject) => {
        const https = require('https');
        const querystring = require('querystring');
        const params = {
            chain_id: "ethereum",
            contract_address: MILADY_CONTRACT,
            token_id: tokenId,
        };
        var options = {
            hostname: 'api.transpose.io',
            path: '/nft/sales-by-token-id?' + querystring.stringify(params),
            method: 'GET',
            headers: {
                'X-API-KEY': TRANSPOSE_API_KEY
            }
        };
        var req = https.request(options, (res) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}
exports.getTokenSales = getTokenSales;
;
/*
    Get the data on the first 0-limit nfts in the collection
    @param {Number} limit
    @return {Object} data
**/
function getAllTokens(limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const https = require('https');
            const querystring = require('querystring');
            const params = {
                chain_id: "ethereum",
                contract_address: MILADY_CONTRACT,
                limit: limit
            };
            var options = {
                hostname: 'api.transpose.io',
                path: '/nft/nfts-by-contract-address?' + querystring.stringify(params),
                method: 'GET',
                headers: {
                    'X-API-KEY': TRANSPOSE_API_KEY
                }
            };
            var req = https.request(options, (res) => {
                console.log('Credits charged:', res.headers['x-credits-charged']);
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });
            req.on('error', (e) => {
                reject(e);
            });
            req.end();
        });
    });
}
exports.getAllTokens = getAllTokens;
;
/*
    * Get the current price of ETH in USD for today
    * @return {String} price
**/
function getEthPriceToday() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const https = require('https');
            const querystring = require('querystring');
            // defaults to current time if no timestamp **
            const params = {
                chain_id: "ethereum",
            };
            var options = {
                hostname: 'api.transpose.io',
                path: '/prices/price?' + querystring.stringify(params),
                method: 'GET',
                headers: {
                    'X-API-KEY': TRANSPOSE_API_KEY
                }
            };
            var req = https.request(options, (res) => {
                console.log('Credits charged:', res.headers['x-credits-charged']);
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });
            req.on('error', (e) => {
                reject(e);
            });
            req.end();
        });
    });
}
exports.getEthPriceToday = getEthPriceToday;
/*
    * Get and group data and perform calculations
    * @param {Number} limit
    * @return {Object} data
**/
function getAllData(limit) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        // Get eth price for later calcs
        const ethPrice = yield getEthPriceToday();
        const ethPriceParse = JSON.parse(ethPrice);
        const ethPriceNumeric = (_a = ethPriceParse === null || ethPriceParse === void 0 ? void 0 : ethPriceParse.results[0]) === null || _a === void 0 ? void 0 : _a.price;
        // get the floor price data from mint date
        const floorPrices = yield getFloorPriceOverTime();
        const floorPriceParse = JSON.parse(floorPrices);
        const floorPriceArray = floorPriceParse === null || floorPriceParse === void 0 ? void 0 : floorPriceParse.results;
        // variables to hold the calculations
        var dailyAverage = 0;
        var weeklyAverage = 0;
        var monthlyAverage = 0;
        var ninetyDayAverage = 0;
        var allTimeAverage = 0;
        var sum = 0;
        // Calculate average prices
        floorPriceArray === null || floorPriceArray === void 0 ? void 0 : floorPriceArray.reverse().slice(0, floorPriceArray === null || floorPriceArray === void 0 ? void 0 : floorPriceArray.length).forEach((sample, index) => {
            sum += sample.floor_price;
            switch (index) {
                case 0:
                    dailyAverage = sample.floor_price;
                    break;
                case 6:
                    weeklyAverage = sum / 7;
                    break;
                case 29:
                    monthlyAverage = sum / 30;
                    break;
                case 89:
                    ninetyDayAverage = sum / 90;
                    break;
                case (floorPriceArray === null || floorPriceArray === void 0 ? void 0 : floorPriceArray.length) - 1:
                    allTimeAverage = sum / (floorPriceArray === null || floorPriceArray === void 0 ? void 0 : floorPriceArray.length);
                    break;
            }
            ;
        });
        console.log("Daily Average Price:", dailyAverage);
        console.log("Weekly Average Price:", weeklyAverage);
        console.log("Monthly Average Price:", monthlyAverage);
        console.log("90-day Average Price:", ninetyDayAverage);
        console.log("All time Average Price:", allTimeAverage);
        // get the token metadata
        const tokens = yield getAllTokens(limit);
        const tokensParsed = JSON.parse(tokens);
        const token_stats = tokensParsed === null || tokensParsed === void 0 ? void 0 : tokensParsed.results;
        const metadata = {
            "description": (_b = token_stats[0]) === null || _b === void 0 ? void 0 : _b.description,
            "example_png": (_c = token_stats[0]) === null || _c === void 0 ? void 0 : _c.image_url,
            "contract_address": (_d = token_stats[0]) === null || _d === void 0 ? void 0 : _d.contract_address,
            "last_refreshed": (_e = token_stats[0]) === null || _e === void 0 ? void 0 : _e.last_refreshed,
            // not normalized over time but didn't want to burn extra credits lol
            "floor_prices": {
                "daily": {
                    "USD": dailyAverage,
                    "ETH": dailyAverage / ethPriceNumeric,
                },
                "weekly": {
                    "USD": weeklyAverage,
                    "ETH": weeklyAverage / ethPriceNumeric,
                },
                "monthly": {
                    "USD": monthlyAverage,
                    "ETH": monthlyAverage / ethPriceNumeric,
                },
                "90-day": {
                    "USD": ninetyDayAverage,
                    "ETH": ninetyDayAverage / ethPriceNumeric,
                },
                "all-time": {
                    "USD": allTimeAverage,
                    "ETH": allTimeAverage / ethPriceNumeric,
                },
            },
            "collection_data": token_stats,
        };
        console.log(metadata);
        return metadata;
    });
}
exports.getAllData = getAllData;
;
/*
    * Get the information of a given token id in the collection
    * @param {String} id
    * @return {Object} data
**/
function getTokenData(id) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // get current owner
        const owner = yield getCurrentOwner(id);
        const ownerParsed = JSON.parse(owner);
        // get past history
        const history = yield getTokenSales(id);
        const historyParsed = JSON.parse(history);
        const metadata = {
            "token_id": id,
            "current_owner": (_a = ownerParsed === null || ownerParsed === void 0 ? void 0 : ownerParsed.results[0]) === null || _a === void 0 ? void 0 : _a.owner,
            "number_previous_owners": (_b = historyParsed === null || historyParsed === void 0 ? void 0 : historyParsed.results) === null || _b === void 0 ? void 0 : _b.length,
            "previous_owners": historyParsed === null || historyParsed === void 0 ? void 0 : historyParsed.results,
        };
        console.log(metadata);
        return metadata;
    });
}
exports.getTokenData = getTokenData;
