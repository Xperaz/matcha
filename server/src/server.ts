import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app: Application = express();
const port: number = parseInt(process.env.SERVER_PORT || "5000", 10);

app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
