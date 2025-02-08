import { ROUTES } from "@/constants/routes";
import useWindowResize from "@/hooks/useWindowResize";
import {
  Bell,
  Mail,
  House,
  UserRoundSearch,
  UserRound,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  hasNewMessages: boolean;
  hasNewNotifications: boolean;
}

const SideBar = ({ hasNewMessages, hasNewNotifications }: Props) => {
  const { width } = useWindowResize();
  const isDesktop = width > 1279;
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0">
      <ul className="flex flex-col justify-between gap-8">
        <Link
          href={ROUTES.app}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.app) ? "text-primary" : ""}`}
        >
          <House size={28} />
          {isDesktop ? "Home" : ""}
        </Link>

        <Link
          href={ROUTES.matches}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.matches) ? "text-primary" : ""}`}
        >
          <Heart size={28} />
          {isDesktop ? "Matches" : ""}
        </Link>

        <Link
          href={ROUTES.explore}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.explore) ? "text-primary" : ""}`}
        >
          <UserRoundSearch size={28} />
          {isDesktop ? "Explore" : ""}
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
          {isDesktop ? "Notifications" : ""}
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
          {isDesktop ? "Messages" : ""}
        </Link>

        <Link
          href={ROUTES.profile}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.profile) ? "text-primary" : ""}`}
        >
          <UserRound />
          {isDesktop ? "Pofile" : ""}
        </Link>
      </ul>
    </div>
  );
};

export default SideBar;
