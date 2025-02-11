"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo from "@/public/images/logo-white.svg";
import { ButtonWithIcon } from "../../atoms/ButtonWithIcon";
import { ROUTES } from "@/constants/routes";
import { useAuthData } from "@/auth/useAuthData";

const PublicHeader = () => {
  const { isAuthenticated } = useAuthData();
  return (
    <header className="w-full flex justify-between mt-4">
      <Image
        src={logo}
        alt="logo"
        style={{ width: "170px", height: "100x" }}
        quality={100}
        placeholder="blur"
        blurDataURL={logo.src}
      />
      <nav>
        <ButtonWithIcon variant="light" className="px-4">
          <Link
            href={isAuthenticated ? ROUTES.app : ROUTES.login}
            className="leading-3 text-lg"
          >
            {isAuthenticated ? "Open app" : "Login"}
          </Link>
        </ButtonWithIcon>
      </nav>
    </header>
  );
};

export default PublicHeader;
