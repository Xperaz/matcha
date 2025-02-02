import Image from "next/image";
import { Trash2 } from "lucide-react"; // Import Lucide icons
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { UserImage } from "@/types/images";
import { useEffect, useState } from "react";
import { getImages } from "@/services/requests/images";
import { deleteImage } from "@/services/requests/images";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { convertToBase64 } from "@/helpers/convertToBase64";
import { uploadImage } from "@/services/requests/images";
import Loader from "../common/Loader";

const ImagesSection = () => {
  const [images, setImages] = useState<UserImage[]>([]);

  const { control } = useForm();
  const queryClient = useQueryClient();

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.images],
    queryFn: async () => {
      const retData = await getImages();
      return retData.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setImages(data);
    }
  }, [data, isSuccess]);

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.images] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (base64Image: string) => uploadImage(base64Image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.images] });
    },
  });

  const handleRemoveImage = async (imageId: string) => {
    if (uploadMutation.isPending) return;
    await deleteMutation.mutateAsync(imageId);
  };

  const handleFilesChange = async (file: File | undefined) => {
    if (!file) return;

    try {
      const fileToBase64 = await convertToBase64(file);
      await uploadMutation.mutateAsync(fileToBase64);
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error while handling file upload:", error);
    }
  };

  const displayLoader =
    isLoading || uploadMutation.isPending || deleteMutation.isPending;

  return (
    <>
      <div className=" flex flex-col gap-4 w-full h-full">
        <div className="flex w-full gap-2 flex-wrap justify-center">
          {images.map((image) => (
            <div
              key={image.id}
              className={`w-60 h-60 relative ${displayLoader ? "pointer-events-none" : ""}`}
            >
              <div className="w-full h-full relative group">
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="z-50 absolute top-2 right-2  text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  disabled={displayLoader}
                >
                  <Trash2 size={24} color="red" />

                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500 ">
                      <Loader />
                    </div>
                  )}
                </button>
                <Image
                  src={image.secure_url}
                  alt="User image"
                  fill
                  className={`rounded-lg transition-all duration-200 ${
                    displayLoader ? "blur-sm brightness-75" : ""
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          {images.length < 4 && (
            <Controller
              name="pictures"
              control={control}
              render={() => (
                <>
                  <Input
                    className="max-w-96 h-11"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFilesChange(e.target.files?.[0])}
                    disabled={displayLoader}
                  />
                </>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ImagesSection;
