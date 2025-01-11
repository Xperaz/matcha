import Image from "next/image";
import { Plus, X } from "lucide-react"; // Import Lucide icons
import image2 from "@/public/images/home.webp";
import image3 from "@/public/images/login.jpeg";
import image4 from "@/public/images/signup.jpg";

const images = [image2, image3, image4, image3];

const ImagesSection = () => {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {/* Image Cards */}
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-square relative">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Delete image"
            >
              <X size={16} /> {/* Lucide X icon */}
            </button>
          </div>
        ))}

        {images.length < 5 && (
          <div className="aspect-square">
            <button className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 gap-2">
              <Plus size={24} className="text-gray-400" />{" "}
              {/* Lucide Plus icon */}
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
