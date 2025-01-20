"use client";

import withProtectedRoute from "@/auth/withProtectedRoute";
import withAppLayout from "../templates/layout/withAppLayout";
import { Swiper } from "@/components/organisms/swipe/Swiper";
import { SwipeFeedback } from "@/components/organisms/swipe/SwipeFeedback";
import { SwipeCardProvider } from "@/context/swipeCardContext";
import Filters from "../organisms/swipe/Filters";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full overflow-hidden">
      <SwipeCardProvider>
        <Filters />
        <SwipeFeedback />
        <Swiper />
      </SwipeCardProvider>
    </div>
  );
};

export default withAppLayout(withProtectedRoute(Home));
