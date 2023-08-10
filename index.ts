import express from 'express';
import { getAllData, getTokenData } from './scripts/scrape';
import { authenticateToken, generateAccessToken } from './scripts/auth';

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
 * >curl localhost:3000/collection_data --Header 'Authorization: Bearer JWT_TOKEN' */

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express API for Milady NFTs');
});

app.post('/createUser', (req, res) => {
    const token = generateAccessToken(req.body.username as string);
    res.json({"access_token": token});
});

// protected api endpoint
app.get("/collection_data", authenticateToken, async (req, res) => {
    const limit = Number(req.query.limit) || 100;
    try {
        const data = await getAllData(limit); // Await the scrape function call
        console.log('here in main', data);
        return res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

// protected api endpoint
app.get("/token_data", authenticateToken, async (req, res) => {
    const token_id = String(req.query.token_id)
    try {
        const data = await getTokenData(token_id); // Await the scrape function call
        return res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});


app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});


