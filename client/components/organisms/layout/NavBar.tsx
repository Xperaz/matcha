"use client";
import React, { FC, useEffect, useState } from "react";
import MobileNavBar from "./MobileNavBar";
import useWindowResize from "@/hooks/useWindowResize";
import SideBar from "./SideBar";
import { IUserType } from "@/types/user";
import useSocketSetup from "@/hooks/useSocketSetup";
import { useAuthData } from "@/auth/useAuthData";

interface NavBarProps {
  userData: IUserType;
}

const NavBar: FC<NavBarProps> = () => {
  const { width } = useWindowResize();
  const { userData } = useAuthData();
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const socket = useSocketSetup();

  useEffect(() => {
    socket.on("new_message", () => {
      setHasNewMessages(true);
    });

    socket.on("new_notification", () => {
      setHasNewNotifications(true);
    });

    return () => {
      socket.off("new_message");
      socket.off("new_notification");
    };
  }, [socket]);

  useEffect(() => {
    if (userData) {
      setHasNewNotifications(userData?.has_new_notifications);
      setHasNewMessages(userData?.has_new_messages);
    }
  }, [userData]);

  return (
    <>
      {width < 769 ? (
        <MobileNavBar
          hasNewMessages={hasNewMessages}
          hasNewNotifications={hasNewNotifications}
        />
      ) : (
        <SideBar
          hasNewMessages={hasNewMessages}
          hasNewNotifications={hasNewNotifications}
        />
      )}
    </>
  );
};

export default NavBar;
