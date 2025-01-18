"use client";
import Image from "next/image";
import logiImg from "@/public/images/login.jpeg";
import LoginForm from "../organisms/LoginForm";
import { useRouter } from "next/navigation";
import getGoogleOAuthURL from "@/helpers/googleUrl";

const Login = () => {
  const router = useRouter();
  const url: string = getGoogleOAuthURL();

  const handleClick = () => {
    router.replace(url);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="font-bold text-[2.8rem] text-gray-900">
              Welcome Back !
            </h1>
            <p className="text-[#994D66]">Sign in to your account</p>
          </div>
          <div className="w-full mt-8">
            <LoginForm />
            <button
              onClick={handleClick}
              className="items-center w-full  bg-blue-500 text-white p-2 rounded"
            >
              login with google
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={logiImg}
          alt="Sign up"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-pink-500/20" />
      </div>
    </div>
  );
};

export default Login;
