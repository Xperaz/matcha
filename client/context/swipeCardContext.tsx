import { createContext, useContext, useState, ReactNode } from "react";

import { swipeRightReq, swipeLeftReq } from "@/services/requests/home";

import { Filters } from "@/types/filters";

interface SwipeCardContextType {
  swipeFeedbackState: string;
  // eslint-disable-next-line no-unused-vars
  swipeRight: (userId: string) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  swipeLeft: (userId: string) => Promise<boolean>;
  filters: Filters;
  // eslint-disable-next-line no-unused-vars
  setFilters: (filters: Filters) => void;

  sortBy: string;
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
    sortBy: "distance",
  });

  const swipeRight = async (userId: string): Promise<boolean> => {
    try {
      setSwipeFeedbackState("right");
      const result = await swipeRightReq(userId);
      return result.data.success;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    } finally {
      setTimeout(() => {
        setSwipeFeedbackState("");
      }, 1000);
    }
  };

  const swipeLeft = async (userId: string): Promise<boolean> => {
    try {
      setSwipeFeedbackState("left");
      const result = await swipeLeftReq(userId);
      return result.data.success;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
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
    sortBy: filters.sortBy,
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
