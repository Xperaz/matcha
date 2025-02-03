"use client";

import Image from "next/image";
import ImagesSection from "./ImagesSection";
import { IUserType } from "@/types/user";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getMyProfile } from "@/services/requests/profile";
import { Loader, Pencil } from "lucide-react";
import avatar from "@/public/images/avatar.png";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";
import EditProfileModal from "./edit-profile/EditProfileModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import HistoryModal from "./like-views-history/HistoryModal";

const ProfileBasicInfo = () => {
  const [user, setUser] = useState<IUserType>({} as IUserType);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [QUERY_KEYS.profileData],
    queryFn: async () => {
      const retData = await getMyProfile();
      return retData.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, isSuccess]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isEditProfileModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditProfileModalOpen(false)}
        />
      )}

      {isHistoryModalOpen && (
        <HistoryModal onClose={() => setIsHistoryModalOpen(false)} />
      )}

      <div className="flex py-4 flex-col gap-8 justify-center p-4">
        <section className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col gap-1 justify-center items-center">
            <div className="w-32 h-32 rounded-full bg-center bg-cover overflow-hidden">
              <Image
                alt="profile picture"
                src={user.profile_picture || avatar}
                width={300}
                height={300}
                priority
              />
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setIsEditProfileModalOpen(true)}
                className="px-2 py-1 bg-gray-200 text-sm rounded-full"
              >
                Edit profile
              </button>
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-2 py-1 bg-gray-200 text-sm rounded-full"
              >
                View History
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-sm text-gray-500 ">
              {user.country} {user.city}
            </p>
          </div>
        </section>

        <section className="mx-4 flex flex-col gap-2">
          <h3 className="text-lg text-center font-bold pb-2">Interest</h3>
          <div className="flex justify-center flex-wrap gap-2">
            {user.interests?.map((interest) => (
              <span
                key={interest}
                className="px-4 py-2 bg-gray-200 text-sm rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>

        <section className="flex flex-col p-4 gap-6">
          <h3 className="text-lg text-center font-bold">About</h3>
          <div className="flex flex-col text-center gap-4">
            <div className="flex flex-col justify-between gap-2 md:flex-row">
              <span className="text-sm text-gray-500 flex-1">fame rating</span>
              <span className="text-sm flex-1">{user.fame_rating}</span>
            </div>
            <div className="flex flex-col justify-between gap-2 md:flex-row">
              <span className="text-sm text-gray-500 flex-1">biography</span>
              <span className="text-sm flex-1">{user.biography}</span>
            </div>
            <div className="flex flex-col justify-between gap-2 md:flex-row">
              <span className="text-sm text-gray-500 flex-1">gender</span>
              <span className="text-sm flex-1">{user.gender}</span>
            </div>
            <div className="flex flex-col justify-between gap-2 md:flex-row">
              <span className="text-sm text-gray-500 flex-1">
                sexual preferences
              </span>
              <span className="text-sm flex-1">{user.sexual_preferences}</span>
            </div>
          </div>
        </section>
        <section className="flex flex-col items-center p-4 gap-6 mx-auto max-w-2xl w-full">
          <h3 className="text-lg font-bold text-center">Credentials</h3>
          <div className="flex flex-col w-full justify-between gap-2 md:flex-row items-center">
            <span className="text-sm text-gray-500">Email</span>
            <div className="flex md:justify-center items-center gap-2">
              <span className="text-sm">{user.email}</span>
              {!user.is_google ? (
                <Pencil
                  size={16}
                  className="cursor-pointer"
                  onClick={() => setIsEditEmailModalOpen(true)}
                  color="#000"
                />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Pencil
                        size={16}
                        className={`${user.is_google ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        color="#000"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email cannot be updated for google accounts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center w-full justify-between gap-2 md:flex-row">
            <span className="text-sm text-gray-500">Password</span>
            <div className="flex md:justify-center items-center  gap-2">
              <span className="text-sm">********</span>
              {!user.is_google ? (
                <Pencil
                  size={16}
                  className="cursor-pointer"
                  onClick={() => setIsEditPasswordModalOpen(true)}
                  color="#000"
                />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Pencil
                        size={16}
                        className={`${user.is_google ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        color="#000"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Password cannot be updated for google accounts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col gap-6">
          <h3 className="text-lg font-bold pb-4 text-center">Images</h3>
          <ImagesSection />
        </section>
      </div>

      {isEditEmailModalOpen && (
        <EmailSection
          onClose={() => setIsEditEmailModalOpen(false)}
          email={user.email}
        />
      )}

      {isEditPasswordModalOpen && (
        <PasswordSection
          onClose={() => setIsEditPasswordModalOpen(false)}
          is_google={user.is_google}
        />
      )}
    </>
  );
};

export default ProfileBasicInfo;
