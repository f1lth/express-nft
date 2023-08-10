import express from 'express';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { getFloorPriceOverTime, 
        getCurrentOwner, 
        getTokenSales, 
        getAllTokens, 
        getAllData
        } from './scripts/scrape';
import { authenticateToken, generateAccessToken} from './scripts/auth';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express API for Milady NFTs');
});

app.post('/createUser', (req, res) => {
    const token = generateAccessToken(req.body.username as string);
    res.json({"access_token": token});
});


app.get("/floor", async (req, res) => {
    try {
        const data = await getFloorPriceOverTime(); // Await the scrape function call
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
    
});

app.get("/current_owner", async (req, res) => {
    const token_id = req.query.token_id as string;
    try {
        const data = await getCurrentOwner(token_id); // Await the scrape function call
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

app.get("/owner_history", async (req, res) => {
    const token_id = req.query.token_id as string;
    try {
        const data = await getTokenSales(token_id); // Await the scrape function call
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

app.get("/tokens", async (req, res) => {
    try {
        const data = await getAllTokens(); // Await the scrape function call
        return res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

// protected api endpoint
app.get("/data", authenticateToken, async (req, res) => {
    try {
        const data = await getAllData(); // Await the scrape function call
        return res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});


app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});


