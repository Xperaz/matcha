import PrivateHeader from "@/components/organisms/PrivateHeader";
import { QUERY_KEYS } from "@/constants/query_keys";
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

  return (
    <div className="appLayout bg-background">
      <header className="border-b-2 border-b-[#E5E8EB] z-50">
        <PrivateHeader userData={data} />
      </header>
      <nav className="leftSideBar">left sidebar</nav>
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
