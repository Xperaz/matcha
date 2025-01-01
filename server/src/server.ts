import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import matchRoutes from "./routes/matchRoutes";
import imageRoutes from "./routes/imageRoutes";
import chatRoutes from "./routes/chatRoutes";

const app: Application = express();
const port: number = parseInt(process.env.SERVER_PORT || "5000", 10);

// CORS setup - must be before routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
