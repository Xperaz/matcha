import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CircleDot } from "lucide-react";
import { formatLastConnection } from "./utils";

interface ProfileGalleryProps {
  profilePicture: string;
  pictures: string[];
  isActive: boolean;
  lastConnection: string;
}

export const ProfileGallery = ({
  profilePicture,
  pictures,
  isActive,
  lastConnection,
}: ProfileGalleryProps) => (
  <div className="relative aspect-[4/5] mb-6">
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="col-span-2 relative">
        <Image
          src={profilePicture ?? null}
          alt="Profile"
          className="w-full h-[400px] object-cover rounded-lg"
          width={0}
          height={0}
          sizes="100vw"
        />
        <div className="absolute top-4 right-4">
          {isActive ? (
            <Badge className="bg-green-500">
              <CircleDot className="w-3 h-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="secondary">
              Last seen {formatLastConnection(lastConnection)}
            </Badge>
          )}
        </div>
      </div>
      <div className="grid grid-rows-2 gap-2">
        {pictures.slice(0, 2).map((img, idx) => (
          <Image
            key={idx}
            src={img ?? null}
            alt={`Gallery ${idx + 1}`}
            className="w-full h-[196px] object-cover rounded-lg"
            width={0}
            height={0}
            sizes="100vw"
          />
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {pictures.slice(2, 4).map((img, idx) => (
        <Image
          key={idx}
          src={img ?? null}
          alt={`Gallery ${idx + 3}`}
          className="w-full h-[200px] object-cover rounded-lg"
          width={0}
          height={0}
          sizes="100vw"
        />
      ))}
    </div>
  </div>
);
