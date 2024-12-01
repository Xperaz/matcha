"use client";
import React from "react";
import { Button } from "../ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

const isAuth = false; // TODO: replace with actual auth check

const Hero = () => {
  return (
    <section className="flex flex-col gap-2 text-center">
      <h1 className="font-extrabold text-white text-[8vw]">
        Swipe Right&#174;
      </h1>
      <div>
        <Link href={ROUTES.register} className="leading-3 text-lg">
          <Button className="primary-gradient primary-gradient:hover text-lg rounded-full">
            {isAuth ? "Find Match" : "Create Account"}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
