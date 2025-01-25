import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import logo from "@/public/images/logo-black.svg";
import { IUserType } from "@/types/user";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/auth/logout";
import { useRouter } from "next/navigation";

const PrivateHeader = ({ userData }: { userData: IUserType | null }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });

  return (
    <>
      <div className="flex w-full h-full justify-between items-center ">
        <div className="flex-1">
          <Image
            src={logo}
            alt="logo"
            width={170}
            height={100}
            quality={100}
            className="md:w-[170px] md:h-[100px] w-[120px] h-[80px]"
          />
        </div>

        <div className="flex w-full items-center flex-1 justify-end gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={userData?.profile_picture}
                  className="rounded-full w-12 h-12"
                  alt={
                    userData
                      ? `${userData?.first_name + userData?.last_name + " image"}`
                      : "profile image"
                  }
                />
                <AvatarFallback>
                  {userData &&
                    `${userData.first_name[0] + userData.last_name[0]}`}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-2 bg-white" align="end">
              <button
                onClick={() => {
                  logoutMutation();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default PrivateHeader;
