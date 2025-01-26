import React from "react";
import MobileNavBar from "./MobileNavBar";
import useWindowResize from "@/hooks/useWindowResize";
import SideBar from "./SideBar";

const NavBar = () => {
  const { width } = useWindowResize();

  return <>{width < 769 ? <MobileNavBar /> : <SideBar />}</>;
};

export default NavBar;
