import Image from "next/image";
import { IUserType } from "@/types/user";

const handleClick = (id: string) => {
  //TODO: redirect to user profile
  alert("You clicked on the user card of " + id);
};

const UserInfoCard = ({ user }: { user: IUserType }) => {
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  return (
    <div
      className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-xl"
      role="button"
      onClick={() => handleClick(user.id)}
    >
      <div className="absolute inset-0">
        <Image
          src={user.profile_picture ?? initials}
          alt={`${user.first_name}'s profile picture`}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h2>
          <span className="text-lg sm:text-xl">{user.age}</span>
        </div>
        <p className="mt-2 text-white/90 line-clamp-2 text-sm sm:text-base">
          {user.biography}
        </p>
      </div>
    </div>
  );
};

export default UserInfoCard;
