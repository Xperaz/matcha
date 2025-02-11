"use client";
import { useEffect, useState } from "react";

const useWindowResize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 770,
    height: 770,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

export default useWindowResize;
