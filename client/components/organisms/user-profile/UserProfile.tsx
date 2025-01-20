"use client";

import Image from "next/image";
import ImagesSection from "./ImagesSection";
import { IUserType } from "@/types/user";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { getMyProfile } from "@/services/requests/profile";
import { Loader } from "lucide-react";
import avatar from "@/public/images/avatar.png";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";

const ProfileBasicInfo = () => {
  const [user, setUser] = useState<IUserType>({} as IUserType);

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

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <Loader />
        </div>
      )}

      {!isLoading && (
        <div className="flex py-4 flex-col gap-8 justify-center mx-auto max-w-[1000px]">
          <section className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-center bg-cover overflow-hidden">
              <Image
                alt="profile picture"
                src={user.profile_picture || avatar}
                width={300}
                height={300}
              />
            </div>
            <h2 className="text-lg font-bold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-sm text-gray-500 ">
              {user.country} {user.city}
            </p>
          </section>
          <section className="mx-4">
            <h3 className="text-lg font-bold pb-2">Interest</h3>
            <div className="flex flex-wrap gap-2">
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
          <section className="flex flex-col mx-4">
            <h3 className="text-lg font-bold">About</h3>
            <div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">fame rating</span>
                <span className="text-sm  w-[300px] overflow-hidden ">
                  {user.fame_rating}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">biography</span>
                <span className="text-sm  w-[300px] overflow-hidden ">
                  {user.biography}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">gender</span>
                <span className="text-sm  w-[300px] overflow-hidden">
                  {user.gender}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">
                  sexual preferences
                </span>
                <span className="text-sm  w-[300px] overflow-hidden">
                  {user.sexual_preferences}
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col mx-4">
            <h3 className="text-lg font-bold pb-2">Credentials</h3>
            <EmailSection email={user.email} is_google={user.is_google} />
            <PasswordSection is_google={user.is_google} />
          </section>
          <section className="mx-4 w-full">
            <h3 className="text-lg font-bold pb-4">Images</h3>
            <ImagesSection />
          </section>
        </div>
      )}
    </>
  );
};

export default ProfileBasicInfo;
