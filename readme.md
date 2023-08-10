# ParagonsDAO Express Server

[![Netlify Status](https://api.netlify.com/api/v1/badges/c15a0031-6cd1-455e-8498-960b85e08232/deploy-status)](https://paragon-express-nft-f1lth.netlify.app/.netlify/functions/api)

[Live Demo](https://paragon-express-nft-f1lth.netlify.app/.netlify/functions/api)

## Endpoints
There are 3 main endpoints (the GET requests require a JWT token) 
- `/createUser` - POST : returns a JWT token for a new user (which you must call first)
- `/collection_data` - GET : returns data from the popular nft collection Milady Maker
- `/token_data?token_id=1234` - GET : returns data for a specific token id, ex: 1234
  

Example: 
```bash 
curl -X POST https://paragon-express-nft-f1lth.netlify.app/.netlify/functions/api/createUser
```
Example: 
```bash
curl https://paragon-express-nft-f1lth.netlify.app/.netlify/functions/api/collection_data --Header 'Authorization: Bearer JWT_TOKEN'
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

## Build

This server is deployed to [Netlify](https://paragon-express-nft-f1lth.netlify.app/.netlify/functions/api).
```bash
npm run build
```