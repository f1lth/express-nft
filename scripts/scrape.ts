require('dotenv').config();

const { TRANSPOSE_API_KEY } = process.env;
const MILADY_CONTRACT = "0x5af0d9827e0c53e4799bb226655a1de152a425a5"

/* 
    * Get the raw floor prices for each day
    * @return {Object} data 
**/
export function getFloorPriceOverTime() {
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
        var req = https.request(options, (res: any) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (d: any) => {
            data += d;
            });
            res.on('end', () => {
            resolve(data);
            });
        });
        req.on('error', (e: any) => {
            reject(e);
        });
        req.write(postData);
        req.end();
    });
};

/*
    * Get the current owner of the token given a token ID
    * @param {String} tokenId
    * @return {Object} data
**/
export function getCurrentOwner(tokenId: string) {
    return new Promise((resolve, reject) => {
        const https = require('https');
        const querystring = require('querystring');
        const params = {
            chain_id: "ethereum",
            contract_address: MILADY_CONTRACT,
            token_id: tokenId,
        }
        var options = {
            hostname: 'api.transpose.io',
            path: '/nft/owners-by-token-id?' + querystring.stringify(params),
            method: 'GET',
            headers: {
            'X-API-KEY': TRANSPOSE_API_KEY
            }
        };
        var req = https.request(options, (res: any) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (d: any) => {
            data += d;
            });
            res.on('end', () => {
            resolve(data);
            });
        });
        req.on('error', (e: any) => {
            reject(e);
        });
        req.end();
    });
};

/*
    * Get the sales history for the token given a token ID
    * @param {String} tokenId
    * @return {Object} data
**/
export function getTokenSales(tokenId: string) {
    return new Promise((resolve, reject) => {
        const https = require('https');
        const querystring = require('querystring');
        const params = {
            chain_id: "ethereum",
            contract_address: MILADY_CONTRACT,
            token_id: tokenId,
        }
        var options = {
            hostname: 'api.transpose.io',
            path: '/nft/sales-by-token-id?' + querystring.stringify(params),
            method: 'GET',
            headers: {
                'X-API-KEY': TRANSPOSE_API_KEY
            }
        };
        var req = https.request(options, (res: any) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (d: any) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e: any) => {
            reject(e);
        });
        req.end();
    });
};
  
/* 
    Get the data on the first 0-limit nfts in the collection 
    @param {Number} limit 
    @return {Object} data
**/
export async function getAllTokens(limit: number) {
    return new Promise((resolve, reject) => {
        const https = require('https');
        const querystring = require('querystring');
        const params = {
          chain_id: "ethereum",
          contract_address: MILADY_CONTRACT,
          limit: limit
        }
        var options = {
            hostname: 'api.transpose.io',
            path: '/nft/nfts-by-contract-address?' + querystring.stringify(params),
            method: 'GET',
            headers: {
                'X-API-KEY': TRANSPOSE_API_KEY
            }
        };
        var req = https.request(options, (res: any) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (chunk: any) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e: any) => {
            reject(e);
        });
        req.end();
      });
};

/*
    * Get the current price of ETH in USD for today
    * @return {String} price
**/
export async function getEthPriceToday() {
    return new Promise((resolve, reject) => {
        const https = require('https');
        const querystring = require('querystring');
        // defaults to current time if no timestamp **
        const params = {
            chain_id: "ethereum",
        }
        var options = {
            hostname: 'api.transpose.io',
            path: '/prices/price?' + querystring.stringify(params),
            method: 'GET',
            headers: {
                'X-API-KEY': TRANSPOSE_API_KEY
            }
        };
        var req = https.request(options, (res: any) => {
            console.log('Credits charged:', res.headers['x-credits-charged']);
            let data = '';
            res.on('data', (chunk: any) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e: any) => {
            reject(e);
        });
        req.end();
      });
}

/*
    * Get and group data and perform calculations 
    * @param {Number} limit
    * @return {Object} data
**/
export async function getAllData(limit: number) {
    // Get eth price for later calcs
    const ethPrice : any = await getEthPriceToday()
    const ethPriceParse = JSON.parse(ethPrice)
    const ethPriceNumeric = ethPriceParse?.results[0]?.price;

    // get the floor price data from mint date
    const floorPrices : any = await getFloorPriceOverTime()
    const floorPriceParse = JSON.parse(floorPrices)
    const floorPriceArray = floorPriceParse?.results;

    // variables to hold the calculations
    var dailyAverage = 0;
    var weeklyAverage = 0;
    var monthlyAverage = 0;
    var ninetyDayAverage = 0;
    var allTimeAverage = 0;
    var sum = 0;

    // Calculate average prices
    floorPriceArray?.reverse().slice(0, floorPriceArray?.length).forEach((sample: any, index: any) => {
        
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
            case floorPriceArray?.length - 1:
                allTimeAverage = sum / floorPriceArray?.length;
                break;
        };
    });
    
    console.log("Daily Average Price:", dailyAverage);
    console.log("Weekly Average Price:", weeklyAverage);
    console.log("Monthly Average Price:", monthlyAverage);
    console.log("90-day Average Price:", ninetyDayAverage);
    console.log("All time Average Price:", allTimeAverage);

    // get the token metadata
    const tokens : any = await getAllTokens(limit)
    const tokensParsed = JSON.parse(tokens)
    const token_stats = tokensParsed?.results

    const metadata : any = {
        "description": token_stats[0]?.description,
        "example_png": token_stats[0]?.image_url,
        "contract_address": token_stats[0]?.contract_address,
        "last_refreshed": token_stats[0]?.last_refreshed,
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
    }

    console.log(metadata);
    return metadata;
};

/*
    * Get the information of a given token id in the collection
    * @param {String} id
    * @return {Object} data
**/
export async function getTokenData(id: string) {
    // get current owner
    const owner : any = await getCurrentOwner(id);
    const ownerParsed = JSON.parse(owner);

    // get past history
    const history : any = await getTokenSales(id);
    const historyParsed = JSON.parse(history);
    
    const metadata : any = {
        "token_id": id,
        "current_owner": ownerParsed?.results[0]?.owner,
        "number_previous_owners": historyParsed?.results?.length,
        "previous_owners": historyParsed?.results,
    };

    console.log(metadata);
    return metadata;
}