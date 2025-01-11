"use client";
import { socket } from "@/app/socket";
import { useEffect } from "react";

const useSocketSetup = () => {
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      // eslint-disable-next-line no-console
      console.error("error while trying to connect to socket");
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);
};

export default useSocketSetup;
