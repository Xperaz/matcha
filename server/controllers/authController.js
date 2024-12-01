import jwt from "jsonwebtoken";

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

        // check if user email is unique

        // insert the user into the db and return the user_id

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