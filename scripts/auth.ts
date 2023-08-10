const jwt = require('jsonwebtoken');
// load dotenv
require('dotenv').config();

export function generateAccessToken(username: any) {
    return jwt.sign({username: username}, process.env.TOKEN_SECRET, { expiresIn: 1800 });
  }

export function authenticateToken(req: any, res: any, next: any) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}