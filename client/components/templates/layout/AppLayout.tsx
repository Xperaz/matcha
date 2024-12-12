import { FC, PropsWithChildren } from "react";

export interface AppLayoutProps {}

const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({ children }) => {
  return (
    <div className="appLayout">
      <header>App Header</header>
      <div className="leftSideBar">left sidebar</div>
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
