import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";

const cookie = require("cookie");

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const socketMap = new Map();

const authorizeUserSocket = (
  socket: AuthenticatedSocket,
  next: (arg0?: Error | undefined) => void
) => {
  try {
    if (!socket.request.headers.cookie) {
      const error = new Error("Authentication failed");
      error.message = "NO_COOKIES";
      return next(error);
    }

    const tokenObj = cookie.parse(socket.request.headers.cookie);

    if (!tokenObj?.jwt) {
      const error = new Error("Authentication failed");
      error.message = "NO_TOKEN";
      return next(error);
    }

    try {
      const token = tokenObj.jwt;

      if (!token) {
        next(new Error("Not authorized!"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      if (!decoded?.id) {
        const error = new Error("Invalid token payload");
        error.message = "INVALID_PAYLOAD";
        return next(error);
      }

      socket.userId = decoded.id;
      socketMap.set(decoded.id, socket.id);

      next();
    } catch (jwtError) {
      const error = new Error("Token verification failed");
      error.message = "INVALID_TOKEN";
      next(error);
    }
  } catch (error) {
    console.error("Socket authorization error:", error);
    next(new Error("Internal server error"));
  }
};

export default authorizeUserSocket;
