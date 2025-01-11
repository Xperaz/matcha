import Image from "next/image";
import { Plus, X } from "lucide-react"; // Import Lucide icons
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query_keys";
import { UserImages } from "@/types/images";
import { useEffect, useState } from "react";
import { getImages } from "@/services/requests/images";
import { deleteImage } from "@/services/requests/images";

const ImagesSection = () => {
  const [images, setImages] = useState<UserImages[]>([]);

  const { data, isSuccess, refetch } = useQuery({
    queryKey: [QUERY_KEYS.images],
    queryFn: async () => {
      const retData = await getImages();
      return retData.data.data;
    },
  });

  const handleRemoveImage = async (imageId: string) => {
    await deleteImage(imageId);
    await refetch();
  };

  useEffect(() => {
    if (data) {
      setImages(data);
    }
  }, [data, isSuccess]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group bg-white rounded-lg  overflow-hidden"
          >
            <div className="aspect-square ">
              <Image
                src={image.secure_url}
                alt="User image"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => handleRemoveImage(image.id)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {images.length < 5 && (
          <div className="">
            <button className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 gap-2">
              <Plus size={24} className="text-gray-400" />{" "}
              <span className="text-sm font-medium text-gray-600">
                Add Image
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImagesSection;
