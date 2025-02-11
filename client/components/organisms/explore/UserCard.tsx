import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tilt } from "react-tilt";
import { tiltOptions } from "@/constants/tilt_card_effect_options";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { IUserType } from "@/types/user";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface Props {
  user: IUserType;
}

const UserCard: FC<Props> = ({ user }) => {
  const router = useRouter();

  const displayUserProfile = () => {
    router.push(`/${user.id}`);
  };
  return (
    <Tilt key={user.id} opeions={tiltOptions}>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={displayUserProfile}
      >
        <CardHeader className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <Image
              src={user.profile_picture}
              alt={`${user.first_name}'s profile`}
              className="object-cover w-full h-full"
              width={300}
              height={300}
              placeholder="blur"
              blurDataURL={user.profile_picture}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <CardTitle className="text-white">
                {user.first_name}, {user.age}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {user.distance && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.distance} km away
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {user.fame_rating}
            </div>
            <div>{user.gender.toLowerCase()}</div>
          </div>
        </CardContent>
      </Card>
    </Tilt>
  );
};

export default UserCard;
