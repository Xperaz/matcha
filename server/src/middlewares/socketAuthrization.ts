import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";

const cookie = require("cookie");

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

const authorizeUserSocket = (
  socket: AuthenticatedSocket,
  next: (arg0?: Error | undefined) => void
) => {
  const tokenObj = cookie.parse(socket.request.headers.cookie);

  if (!tokenObj) {
    next(new Error("Not authorized!"));
  }

  const token = tokenObj.jwt;

  if (!token) {
    next(new Error("Not authorized!"));
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  if (!decoded) {
    next(new Error("Not authorized!"));
  }

  socket.userId = decoded.id;
  console.log("decoded data => ", decoded);
  console.log("user id =>", socket.userId);

  next();
};

export default authorizeUserSocket;
