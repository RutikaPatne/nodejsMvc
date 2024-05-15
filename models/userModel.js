import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


import dotenv from'dotenv'

dotenv.config();

const pool = new Pool({
    user: 'postgres',
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: 5432
});


const register = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hash(password, 10);
    pool.query(`INSERT INTO usertable (username, password) VALUES ($1, $2) RETURNING *`, [username, password], (err, result) => {
        if (err) {
            throw err
        }
        else {
            res.status(200).json({ data: result.rows[0], msg: "user registered successfully" });

        }
    });
};



const loginFunction = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { rows } = await pool.query(`SELECT * FROM usertable WHERE username=$1 and password=$2`, [username, password])
        if (rows.length > 0) {
            const token = jwt.sign(rows[0], process.env.SECRET_KEY, { expiresIn: '1h' })
            const userToken = await pool.query(`UPDATE usertable SET token=$1 WHERE username=$2 RETURNING *`, [token, username]);
            console.log(userToken.rows[0])
            console.log(rows[0])
            res.status(200).json({ data: userToken.rows[0], msg: "login successfully" })
        }
        else {
            res.status(401).send("login unsuccessful")
        }
    }
    catch (err) {
        console.log(err)
    }
}





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

const profile = (req, res) => {
    res.json({ message: 'Access granted to profile' });
};


const logoutFunction = (req, res) => {
    const id = req.query.id;
    const token = null;
    const result = pool.query(`UPDATE usertable SET token=$1 WHERE id=$2`, [token, id], (err, result) => {
        if (err) {
            throw err
        }
        else {
            res.send(`logout successfully`)
        }
    })

}



const updateUser = (req, res) => {
    let id = req.query.id
    const { username, password } = req.body

    pool.query(`UPDATE usertable SET username=$1 , password=$2  where id=$3`, [username, password, id], (err, result) => {
        if (err) {
            throw err
        }
        res.json({
            data: "updated successfully"
        })
    })
}



const deleteUser = (req, res) => {
    let id = req.query.id;

    pool.query(`DELETE FROM usertable WHERE id=$1`, [id], (err, result) => {
        if (err) {
            throw err
        }
        res.json({
            msg: `user with ${id} deleted successfully`
        })
    })
}


export { register, loginFunction, logoutFunction,authMiddleware, updateUser, deleteUser,profile };
