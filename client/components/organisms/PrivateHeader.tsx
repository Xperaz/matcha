import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import SearchBar from "../molecules/SearchBar";
import Image from "next/image";
import logo from "@/public/images/logo-black.svg";
import { IUserType } from "@/types/user";

const PrivateHeader = ({ userData }: { userData: IUserType | null }) => {
  return (
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
        <div>
          <SearchBar />
        </div>
        <Avatar
          onClick={() => {
            // TODO: add logout logi
          }}
        >
          <AvatarImage
            className={`rounded-full w-16 h-16`}
            // border need to be added in case of missing profile image
            // src={''} : profile image need to be added to user data
            alt={
              userData
                ? `${userData?.first_name + userData?.last_name + " image"}`
                : "profile image"
            }
          />
          <AvatarFallback>
            {userData && `${userData.first_name[0] + userData.last_name[0]}`}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default PrivateHeader;
