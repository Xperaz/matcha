const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

dotenv.config();

// routes
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(express.json()); // middleware to parse incoming requests
app.use(cookieParser()); // for parsing cookies


app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log("listening on port " + port);
});
