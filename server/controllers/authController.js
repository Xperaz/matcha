const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Fix the import
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const matchPassword = async (password, match) => {
    return await bcrypt.compare(password, match);
};

const signup = async (req, res) => {

  const { first_name, last_name, password, email, gender, age } = req.body;

  try {
    if (!first_name || !last_name || !password || !email || !gender || !age) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    
    if (age < 18){
        return res.status(400).json({
          success: false,
          message: "you are under age",
        });
    }

    // Check if a user already exists with the email
    const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await db.query(emailCheckQuery, [email]);

    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the users table
    const insertUserQuery = `
      INSERT INTO users (first_name, last_name, password, email, gender, age)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;

    const values = [first_name, last_name, hashedPassword, email, gender, age];
    const result = await db.query(insertUserQuery, values);

    const user_id = result.rows[0].id;

    console.log(user_id);

    // Generate JWT
    const token = signToken(user_id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });

  } catch (ex) {
        console.error("Error from signup:", ex);
        res.status(500).json({
        success: false,
        message: "Error from signup",
        });
  }
};


const signin = async (req, res) => {

    const {email, password} = req.body;

    try{
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
              });
        }

        // check the user

        const emailCheckQuery = `
            SELECT id, email, password FROM users WHERE email = $1;
        `
        const { rows } = await db.query(emailCheckQuery, [email]);

        if (rows.length != 1){
            return res.status(400).json({
                success: false,
                message: "invalid email"
            });
        }

        if (!(await matchPassword(password, rows[0].password))){
            return res.status(400).json({
                success: false,
                message: "invalid password"
            });
        }

        const token = signToken(rows[0].id);

        res.cookie("jwt", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          sameSite: "strict"
        });
        
        res.status(200).json({
            success: true,
            message: "Signin successful"
        });


    } catch(ex){
        console.error("Error from signin:", ex);
        res.status(500).json({
        success: false,
        message: "Error from signin"
        });
    }
};

module.exports = {
    signup,
    signin
  };
