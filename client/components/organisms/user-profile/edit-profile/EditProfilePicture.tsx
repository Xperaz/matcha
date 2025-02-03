import { Control, Controller, FieldErrors } from "react-hook-form";
import Image from "next/image";
import { FileUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import useWindowResize from "@/hooks/useWindowResize";
import { convertToBase64 } from "@/helpers/convertToBase64";
import { ChangeEvent, FC, useState } from "react";
import { EditProfileSchemaType } from "@/schemas/EditProfileSchema";

interface ProfilePictureUploadProps {
  control: Control<EditProfileSchemaType>;
  errors: FieldErrors<EditProfileSchemaType>;
  defaultImage: string;
}

const EditProfilePicture: FC<ProfilePictureUploadProps> = ({
  control,
  errors,
  defaultImage,
}) => {
  const { width } = useWindowResize();
  const [profile_picture, setProfilePicture] = useState<
    string | File | undefined
  >(defaultImage);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line no-unused-vars
    onChange: (value: any) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertToBase64(file);
        setProfilePicture(base64String);
        onChange(base64String);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error converting file to base64: ", error);
      }
    }
  };

  return (
    <Controller
      name="profile_picture"
      control={control}
      // eslint-disable-next-line no-unused-vars
      render={({ field: { onChange, value } }) => (
        <div className="flex items-center gap-4">
          {profile_picture && typeof profile_picture === "string" && (
            <Image
              src={profile_picture}
              alt="Preview"
              className={`${width > 769 ? "w-32" : "w-24"} ${
                width > 769 ? "h-32" : "h-24"
              } rounded-full object-cover`}
              width={width > 769 ? 32 : 24}
              height={width > 769 ? 32 : 24}
              priority
            />
          )}
          <div className="flex flex-col gap-1">
            <div className="flex gap-4 items-center">
              {!profile_picture && (
                <div className="bg-slate-400 rounded-full p-4">
                  <FileUser size={20} />
                </div>
              )}
              <Input
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={(e) => handleFileChange(e, onChange)}
                className="hidden"
              />
              <label
                htmlFor="profile_picture"
                className="cursor-pointer text-primary"
              >
                Upload a profile picture
              </label>
            </div>
            {errors?.profile_picture && (
              <p className="text-red-500 text-sm">
                {errors.profile_picture.message}
              </p>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default EditProfilePicture;
