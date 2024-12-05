import express from "express";
import dotenvt from "dotenv";

//routes
import authRoutes from "./routes/authRoutes.js";

dotenvt.config();

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(express.json()); //middelware to parse incoming requests

app.use("/api/auth", authRoutes);

app.listen(port, console.log("listening on port " + port ));