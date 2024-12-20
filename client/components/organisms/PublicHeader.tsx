import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo from "@/public/images/logo-white.svg";
import { ButtonWithIcon } from "../atoms/ButtonWithIcon";
import { ROUTES } from "@/constants/routes";

const PublicHeader = () => {
  return (
    <header className="w-full flex justify-between mt-4">
      <Image src={logo} alt="logo" width={170} height={100} quality={100} />
      <nav>
        <ButtonWithIcon variant="light" className="px-4">
          <Link href={ROUTES.login} className="leading-3 text-lg">
            Log in
          </Link>
        </ButtonWithIcon>
      </nav>
    </header>
  );
};

export default PublicHeader;
