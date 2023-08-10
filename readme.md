# ParagonsDAO Express Server

[![Netlify Status](https://api.netlify.com/api/v1/badges/c15a0031-6cd1-455e-8498-960b85e08232/deploy-status)](https://app.netlify.com/sites/paragon-express-nft-f1lth/deploys)

## Endpoints
There are 3 main endpoints: 
- `/createUser` - returns a JWT token for a new user
- `/collection_data` - returns data from the popular nft collection Milady Maker
- `/token_data` - returns data for a specific token id
  
Example: 
```bash
curl localhost:3000/createUser
```
Example: 
```bash
curl localhost:3000/collection_data --Header 'Authorization: Bearer JWT_TOKEN'
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Setup environment variables:

```bash
cp .env.example .env
```

3. Run the server:

```bash
npm run start
```

## Deploy

This server is deployed to [Netlify](https://www.netlify.com/).
```bash
tsc -p .```