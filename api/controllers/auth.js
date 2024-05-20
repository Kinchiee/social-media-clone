import { db } from '../database.js';
import bcrypt from 'bcryptjs';

export const register = (req, res) => {

    //Check if user exists
    const query = "SELECT * FROM users WHERE username = ?"
    db.query(query, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("User already exists!")
        //Create a new user
        //Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const query = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE(?)";
        const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

        db.query(query, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.")
        });
    });
}

export const login = (req, res) => {
    const query = "SELECT * FROM users WHERE username = ?"

    db.query(query, [req.body.username], (err,data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(400).json('User not found!');

    })

}

export const logout = (req, res) => {
    
}