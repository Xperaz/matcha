import { ROUTES } from "@/constants/routes";
import useWindowResize from "@/hooks/useWindowResize";
import { Bell, Mail, House, UserRoundSearch, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
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
          <Bell />
          {isDesktop ? "Notifications" : ""}
        </Link>

        <Link
          href={ROUTES.messages}
          className={`flex gap-4 items-center ${pathname.includes(ROUTES.messages) ? "text-primary" : ""}`}
        >
          <Mail />
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
