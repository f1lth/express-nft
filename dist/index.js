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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scrape_1 = require("./scripts/scrape");
const auth_1 = require("./scripts/auth");
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
const app = (0, express_1.default)();
const compression = require('compression');
app.use(express_1.default.json());
app.use(compression()); // Compress all routes
app.get('/', (req, res) => {
    res.send('Express API for Milady NFTs');
});
app.post('/createUser', (req, res) => {
    const token = (0, auth_1.generateAccessToken)(req.body.username);
    res.json({ "access_token": token });
});
// protected api endpoint
app.get("/collection_data", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(req.query.limit) || 100;
    try {
        const data = yield (0, scrape_1.getAllData)(limit); // Await the scrape function call
        console.log('here in main', data);
        return res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
}));
// protected api endpoint
app.get("/token_data", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token_id = String(req.query.token_id);
    try {
        const data = yield (0, scrape_1.getTokenData)(token_id); // Await the scrape function call
        return res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
}));
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
