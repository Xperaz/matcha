import Image from "next/image";
import Baraka from "@/public/images/baraka.gif";

export function NoMoreUsers() {
  return (
    <div className="flex flex-col rounded-lg items-center justify-center h-full text-center p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        No more users to swipe!
      </h2>
      <p className="text-2xl mb-2">Baraka</p>
      <Image className="rounded-lg" src={Baraka} alt="Baraka" quality={100} />
    </div>
  );
}
