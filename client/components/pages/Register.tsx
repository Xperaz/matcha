import React from "react";
import Image from "next/image";
import signUpImg from "@/public/images/signup.jpg";
import ResigterForm from "../organisms/signup-signin/ResigterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={signUpImg}
          alt="Sign up"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-pink-500/20" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="font-bold text-[2.8rem] text-gray-900">
              Welcome to Matcha
            </h1>
            <p className="text-[#994D66]">
              Create an account to start finding your match
            </p>
          </div>
          <div className="w-full mt-8">
            <ResigterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
