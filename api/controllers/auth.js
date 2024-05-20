import { db } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
};

export const login = (req, res) => {
    //This query the database
    const query = "SELECT * FROM users WHERE username = ?"
    //Based on the result we set error and data response
    db.query(query, [req.body.username], (err,data) => {
        //If there is an error we return status 500
        if (err) return res.status(500).json(err);
        //If there is a no data we return status 400
        if (data.length === 0) return res.status(400).json('User not found!');
        //Then if there is actually a data. We compare the inputted password (req.body.password) in the password data that we have been query
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        //Return status 400 if it's the wrong password
        if (!checkPassword) return res.status(400).json('Wrong password or username!');

        const token = jwt.sign({id: data[0].id}, "secretkey")

        const {password, ...others} = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(others);
    });

};

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been logged out")
    
}