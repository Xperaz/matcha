import jwt from "jsonwebtoken";
import * as Connection from "../config/db.js";
import bcrypt from "bcryptjs";

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}
export const signup = async (req, res) => {

    const {first_name, last_name, password, email, gender } = req.body;
    try{
        if (!first_name || !last_name || !password || !email || !gender)
        {
            return res.status(400).json({
                success: false,
                message: "all fields are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        // check ila kan chi user khdam bhad email
        const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await Connection.query(emailCheckQuery, [email]);

        if (rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email is already in use",
            });
        }

        // Insert user into the users table
        const insertUserQuery = `
            INSERT INTO users (first_name, last_name, password, email, gender)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        
        const values = [first_name, last_name, hashedPassword, email, gender];
        const result = await Connection.query(insertUserQuery, values);

        const user_id = result.rows[0].id;

        const token = signToken(user_id);
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // for XSS atacks
            sameSite: "strict" // for CSRF attacks
        });

        res.status(201).json({
            success: true,
        });

    } catch(ex){
        console.log("error from signup", ex);
        res.status(500).json({
            success: false,
            message: "error from signup"
        });
    }
// get the data from the req body and validate it then hash the (password) and store them;
};