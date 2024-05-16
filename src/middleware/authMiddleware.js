import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

import {pool} from '../config/db.js'

const authMiddleware = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).send('Authorization header is required');
    }

    const parts = header.split(' ');
    if (parts[0] !== 'Bearer') {
        return res.status(401).send('Authorization header must be in the format Bearer [token]');
    }

    const token = parts[1];
    console.log(token)

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //check token against db
    const checking = await pool.query(`SELECT * FROM usertable WHERE username=$1 and token =$2`, [decoded.username, token])
    if (checking.rows.length > 0) {
        req.user = decoded;
        next();
    }
    else {
        res.send('unauthorized token')
    }
}

export {authMiddleware}
