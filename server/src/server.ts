import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import matchRoutes from "./routes/match.routes";
import imageRoutes from "./routes/image.routes";
import seedDataBase from "./routes/seed.routes";
import profileRoutes from "./routes/profile.routes";
import chatRoutes from "./routes/chat.routes";
import notifRoutes from "./routes/notif.routes";
import searchRoutes from "./routes/search.routes";
import blockRoutes from "./routes/block.routes";
import historyRoutes from "./routes/history.routes";
import reportRoutes from "./routes/report.routes";

import authorizeUserSocket, {
  AuthenticatedSocket,
} from "./middlewares/socketAuthrization";
import { report } from "process";

const app: Application = express();
const port: number = parseInt(process.env.SERVER_PORT || "5000", 10);
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

// CORS setup - must be before routes
app.use(
  cors({
    origin: ["http://10.13.4.8:3000", "http://localhost:3000"],
    optionsSuccessStatus: 200,
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
app.use("/api/profile", profileRoutes);
app.use("/api/seed", seedDataBase);
app.use("/api/chat", chatRoutes);
app.use("/api/notif", notifRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/block", blockRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/history", historyRoutes);

io.use(authorizeUserSocket);
io.on("connection", (socket: AuthenticatedSocket) => {
  // TODO: set user as connected userService.setUserOffline
});
// TODO: remove user socket from socketMap
//TODO: set user a disconnected userService.setUserOffline

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
