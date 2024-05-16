//crud 
import { pool } from '../config/db.mjs'

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

export{updateUser,deleteUser}
