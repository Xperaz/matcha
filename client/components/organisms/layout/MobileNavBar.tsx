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

const MobileNavBar = () => {
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
          <Bell />
        </Link>

        <Link
          href={ROUTES.messages}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.messages) ? "text-primary" : ""}`}
        >
          <Mail />
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
