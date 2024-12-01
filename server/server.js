import express from "express";
import dotenvt from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from 'fs';

//routes
import authRoutes from "./routes/authRoutes.js";

dotenvt.config();

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(express.json()); //middelware to parse incoming requests
app.use(cookieParser()); // for parssing cookies


// adding swagger
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve("./swagger.json"), "utf8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/api/auth", authRoutes);

app.listen(port, console.log("listening on port " + port ));