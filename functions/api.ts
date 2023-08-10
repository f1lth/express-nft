import express, { Router } from 'express';
import { getAllData, getTokenData } from '../scripts/scrape';
import { authenticateToken, generateAccessToken } from '../scripts/auth';

/**
 * Backend Engineering Task : Analysing an Existing NFT Collection
 *  - Created a new Express API that will return the data from the collection
 *  - 2 data endpoints and one to generate a JWT token:
 *      
 *     - /collection_data
 *     - /token_data
 *     - /createUser
 * 
 * call like this:
 * >curl localhost:3000/createUser //get your JWT_TOKEN here first
 * >curl localhost:3000/collection_data --Header 'Authorization: Bearer JWT_TOKEN' 
 */

const compression = require('compression');
const serverless = require('serverless-http');

const app = express();
const router = Router();

app.use(compression()); // Compress all routes
app.use(express.json()); // for parsing application/json

router.get('/', (req, res) => {
    res.send('Express API for Milady NFTs');
});

router.post('/createUser', (req, res) => {
    const token = generateAccessToken(String(req.body.username));
    res.json({"access_token": token});
});

// protected api endpoint
router.get("/collection_data", authenticateToken, async (req, res) => {
    const limit = Number(req.query.limit) || 100;
    try {
        const data = await getAllData(limit); // Await the scrape function call
        return res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

// protected api endpoint
router.get("/token_data", authenticateToken, async (req, res) => {
    const token_id = String(req.query.token_id)
    try {
        const data = await getTokenData(token_id); // Await the scrape function call
        return res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);