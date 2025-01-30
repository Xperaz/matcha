import { Badge } from "@/components/ui/badge";
import { IPublicProfileType } from "@/types/user";
import React, { FC } from "react";

interface ProfileInfoProps {
  user: IPublicProfileType;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold mb-2">About {user?.first_name}</h2>
        <p className="text-gray-600">{user?.biography}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {user?.interests.map((interest, idx) => (
            <Badge key={idx} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
