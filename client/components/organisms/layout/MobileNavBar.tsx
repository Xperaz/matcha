import { ROUTES } from "@/constants/routes";
import {
  Bell,
  House,
  Mail,
  UserRoundSearch,
  UserRound,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  hasNewMessages: boolean;
  hasNewNotifications: boolean;
}

const MobileNavBar = ({ hasNewMessages, hasNewNotifications }: Props) => {
  const pathname = usePathname();
  return (
    <div className="sticky bottom-0 h-full w-full bg-background">
      <ul className="flex justify-between items-center">
        <Link
          href={ROUTES.app}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.app) ? "text-primary" : ""}`}
        >
          <House />
        </Link>

        <Link
          href={ROUTES.matches}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.matches) ? "text-primary" : ""}`}
        >
          <Heart />
        </Link>

        <Link
          href={ROUTES.explore}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.explore) ? "text-primary" : ""}`}
        >
          <UserRoundSearch />
        </Link>

        <Link
          href={ROUTES.notifications}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.notifications) ? "text-primary" : ""}`}
        >
          {hasNewNotifications ? (
            <div className="relative">
              <Bell />
              <span className="absolute -top-2 -right-2 h-3 w-3 bg-primary rounded-full"></span>
            </div>
          ) : (
            <Bell />
          )}
        </Link>

        <Link
          href={ROUTES.messages}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.messages) ? "text-primary" : ""}`}
        >
          {hasNewMessages ? (
            <div className="relative">
              <Mail />
              <span className="absolute -top-2 -right-2 h-3 w-3 bg-primary rounded-full"></span>
            </div>
          ) : (
            <Mail />
          )}
        </Link>

        <Link
          href={ROUTES.profile}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.profile) ? "text-primary" : ""}`}
        >
          <UserRound />
        </Link>
      </ul>
    </div>
  );
};

export default MobileNavBar;
