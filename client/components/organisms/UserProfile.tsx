"use client";

import Image from "next/image";
import avatr from "@/public/images/avatar.png";
import ImagesSection from "./ImagesSection";

const ProfileBasicInfo = () => {
  return (
    <div className="flex py-4 flex-col gap-8 justify-center mx-auto max-w-4xl">
      <section className="flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-center bg-cover bg-green-400 overflow-hidden">
          <Image alt="profile picture" src={avatr} />
        </div>
        <h2 className="text-lg font-bold">first name last name</h2>
        <p className="text-sm text-gray-500 ">country city</p>
      </section>
      <section className="mx-4">
        <h3 className="text-lg font-bold pb-2">Interest</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-2 bg-gray-200 text-sm rounded-full">
            Hiking
          </span>
          <span className="px-4 py-2 bg-gray-200 text-sm rounded-full">
            Hiking
          </span>
          <span className="px-4 py-2 bg-gray-200 text-sm rounded-full">
            Hiking
          </span>
          <span className="px-4 py-2 bg-gray-200 text-sm rounded-full">
            Hiking
          </span>
          <span className="px-4 py-2 bg-gray-200 text-sm rounded-full">
            Hiking
          </span>
        </div>
      </section>
      <section className="flex flex-col mx-4">
        <h3 className="text-lg font-bold">About</h3>
        <div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">fame rating</span>
            <span className="text-sm  w-[300px] overflow-hidden ">12</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">biography</span>
            <span className="text-sm  w-[300px] overflow-hidden ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">gender</span>
            <span className="text-sm  w-[300px] overflow-hidden">MALE</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">sexual preferences</span>
            <span className="text-sm  w-[300px] overflow-hidden">FEMAL</span>
          </div>
        </div>
      </section>
      <section className="flex flex-col mx-4">
        <h3 className="text-lg font-bold pb-2">Credentials</h3>
        <div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm  w-[300px] overflow-hidden ">
              email@gmail.com
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">password</span>
            <span className="text-sm w-[300px] overflow-hidden">
              **********
            </span>
          </div>
        </div>
      </section>
      <section className="mx-4">
        <h3 className="text-lg font-bold pb-2">Images</h3>
        <ImagesSection />
      </section>
    </div>
  );
};

export default ProfileBasicInfo;
