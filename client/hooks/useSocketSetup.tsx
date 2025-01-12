/* eslint-disable no-console */
"use client";
import { socket } from "@/app/socket";
import { useEffect } from "react";

const useSocketSetup = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Socket connected successfully");
    };

    const onConnectError = (error: Error) => {
      console.error("Socket connection error:", error);
    };

    const onDisconnect = (reason: string) => {
      console.log("Socket disconnected:", reason);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocketSetup;
