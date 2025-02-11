import React, { FC } from "react";

interface ErrorProps {
  title?: string;
  error?: string;
}

const CustomError: FC<ErrorProps> = ({ title, error }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg p-8">
        <div className="flex flex-col text-start">
          <h1 className="font-bold text-3xl mb-2">
            {title ?? "Something went wrong"}
          </h1>
          <p className="font-light text-md text-gray-600">
            {error ?? "something went wrong please try again later"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomError;
