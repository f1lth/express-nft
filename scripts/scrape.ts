require('dotenv').config();

const { TRANSPOSE_API_KEY } = process.env;
const MILADY_CONTRACT = "0x5af0d9827e0c53e4799bb226655a1de152a425a5"

// NFT queries for the Milady Maker project
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
  

export async function getAllTokens() {
    return new Promise((resolve, reject) => {
        const https = require('https');
        const querystring = require('querystring');
        const params = {
          chain_id: "ethereum",
          contract_address: MILADY_CONTRACT,
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

export async function getAllData() {

    console.log('inside get all data')

    const token_ids : any = await getAllTokens()
    const parsed = JSON.parse(token_ids)

    const stats = parsed.results
    const metadata : any = {
        "description": stats[0]?.description,
        "example_png": stats[0]?.image_url,
        "contract_address": stats[0]?.contract_address,
        "last_refreshed": stats[0]?.last_refreshed,
    }

    // map over all token ids and get the data
    const tokenData = await Promise.all(stats.map(async (token: any) => {
        const tokenId = token.token_id
        console.log(tokenId)
        const sales : any = await getTokenSales(tokenId)
        const owner : any = await getCurrentOwner(tokenId)
        const parsedSales = JSON.parse(sales)
        const parsedOwner = JSON.parse(owner)
        const salesData = parsedSales.results
        const ownerData = parsedOwner.results
        const tokenData = {
            "token_id": tokenId,
            "sales": salesData,
            "owner": ownerData,
        }
        return tokenData
    }

    
    ))
}