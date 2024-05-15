import { pool } from '../config/db.mjs'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();



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


export { register, loginFunction, logoutFunction, updateUser, deleteUser, profile };
