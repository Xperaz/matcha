/* eslint-disable no-console */
"use client";
import { socket } from "@/app/socket";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useSocketSetup = () => {
  const router = useRouter();
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {};

    const onConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);

      switch (error.message) {
        case "NO_COOKIES":
        case "NO_TOKEN":
        case "INVALID_TOKEN":
        case "INVALID_PAYLOAD":
          router.push("/login");
          break;
        default:
          console.error("Unexpected socket error:", error);
      }
    };

    const onDisconnect = () => {};

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
