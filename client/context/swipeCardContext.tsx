import { createContext, useContext, useState, ReactNode } from "react";

import { swipeRightReq, swipeLeftReq } from "@/services/requests/home";

import { Filters } from "@/types/filters";

interface SwipeCardContextType {
  swipeFeedbackState: string;
  // eslint-disable-next-line no-unused-vars
  swipeRight: (userId: string) => void;
  // eslint-disable-next-line no-unused-vars
  swipeLeft: (userId: string) => void;
  filters: Filters;
  // eslint-disable-next-line no-unused-vars
  setFilters: (filters: Filters) => void;
}

interface Props {
  children: ReactNode;
}

const SwipeCardContext = createContext<SwipeCardContextType | null>(null);

export const SwipeCardProvider = ({ children }: Props) => {
  const [swipeFeedbackState, setSwipeFeedbackState] = useState("");
  const [filters, setFilters] = useState<Filters>({
    ageRange: [18, 100],
    distanceRange: [0, 1000],
    fameRatingRange: [1, 100],
    commonInterests: 0,
  });

  const swipeRight = async (userId: string) => {
    try {
      setSwipeFeedbackState("right");
      await swipeRightReq(userId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setTimeout(() => {
        setSwipeFeedbackState("");
      }, 1000);
    }
  };

  const swipeLeft = async (userId: string) => {
    try {
      setSwipeFeedbackState("left");
      await swipeLeftReq(userId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setTimeout(() => {
        setSwipeFeedbackState("");
      }, 1000);
    }
  };

  const values = {
    swipeFeedbackState,
    swipeRight,
    swipeLeft,
    filters,
    setFilters,
  };

  return (
    <SwipeCardContext.Provider value={values}>
      {children}
    </SwipeCardContext.Provider>
  );
};

export const useSwipeCardContext = () => {
  const context = useContext(SwipeCardContext);

  if (!context) {
    throw new Error(
      "useSwipeCardContext must be used within the SwipeCardProvider",
    );
  }

  return context;
};
