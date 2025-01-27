import NavBar from "@/components/organisms/layout/NavBar";
import PrivateHeader from "@/components/organisms/layout/PrivateHeader";
import { QUERY_KEYS } from "@/constants/query_keys";
import useWindowResize from "@/hooks/useWindowResize";
import { getUser } from "@/services/requests/home";
import { useQuery } from "@tanstack/react-query";
import { FC, PropsWithChildren } from "react";

export interface AppLayoutProps {}

const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({ children }) => {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: async () => {
      const data = await getUser();
      return data.data.user;
    },
  });

  const { width } = useWindowResize();

  return (
    <div className="appLayout bg-background">
      <header className="border-b-2 border-b-[#E5E8EB] z-50">
        <PrivateHeader userData={data} />
      </header>
      <nav
        className={`${width < 768 ? "bg-background border-t-2 border-t-[#E5E8EB]" : "bg-transparent border-r-2 border-r-[#E5E8EB]"}`}
      >
        <NavBar />
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
