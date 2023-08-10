const jwt = require('jsonwebtoken');

require('dotenv').config();

/*
    * Generate an access token for a user.
    * @param {Object} user
    * @return {String} token
//  */
export function generateAccessToken(username: any) {
    // set token expiration to 1 hour
    return jwt.sign({username: username}, process.env.TOKEN_SECRET, { expiresIn: 3600 });
  }

/*
    * Authenticate the user's token then call the next function.
    * @param {Object} req
    * @param {Object} res
    * @param {Object} next
    `@return {Object} user
*/
export function authenticateToken(req: any, res: any, next: any) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};