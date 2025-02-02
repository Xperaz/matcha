"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import { Swiper } from "@/components/organisms/swipe/Swiper";
import { SwipeFeedback } from "@/components/organisms/swipe/SwipeFeedback";
import { SwipeCardProvider } from "@/context/swipeCardContext";
import Filters from "../organisms/swipe/Filters";
import { useState } from "react";
import { Button } from "../ui/button";

const Home = () => {
  const [isFiterModalOpen, setIsFilterModalOpen] = useState(false);
  return (
    <div className="container mx-auto px-4 flex flex-col md:gap-2">
      <SwipeCardProvider>
        <div className="flex justify-between items-center py-4 md:py-6">
          <h1 className="text-2xl font-bold">Explore</h1>
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-primary text-white"
          >
            {"Advanced Search"}
          </Button>
        </div>

        {isFiterModalOpen && (
          <Filters onClose={() => setIsFilterModalOpen(false)} />
        )}

        <div className="flex justify-center items-start">
          <div className="relative">
            <SwipeFeedback />
            <Swiper />
          </div>
        </div>
      </SwipeCardProvider>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Home));
