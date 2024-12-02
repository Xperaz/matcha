const jwt = require("jsonwebtoken");
const db = require("../config/db");



const protectRoutes = async (req, res, next) => {

    try{
        const token = req.cookies.jwt;

        if (!token){
            return res.status(401).json({
                sucesss: false,
                message: "you are not authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "you are not authorized"
            });
        }

        const getUserQuery = `
            SELECT * FROM users WHERE id = $1;
        `
        const result = await db.query(getUserQuery, [decoded.id]);

        console.log(result);

        req.user = result[0];

        next();

    } catch (ex){
        console.error("Error from authMiddlware", ex);
        res.status(500).json({
        success: false,
        message: "Error from auth",
        });
    }
}