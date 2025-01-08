import Image from "next/image";

const handleClick = (name: string) => {
  alert("You clicked on the user card of " + name);
};

const UserInfoCard = ({
  name,
  bio,
  profilePicture,
  age,
}: {
  name: string;
  bio: string | null;
  profilePicture: string;
  age: number;
}) => {
  return (
    <div
      className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-xl"
      role="button"
      onClick={() => handleClick(name)}
    >
      <div className="absolute inset-0">
        <Image
          src={profilePicture}
          alt={`${name}'s profile picture`}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">{name}</h2>
          <span className="text-lg sm:text-xl">{age}</span>
        </div>
        <p className="mt-2 text-white/90 line-clamp-2 text-sm sm:text-base">
          {bio}
        </p>
      </div>
    </div>
  );
};

export default UserInfoCard;
