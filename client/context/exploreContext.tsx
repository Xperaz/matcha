import { ReactNode, createContext, useContext, useState } from "react";

export interface SearchFilters {
  ageRange: [number, number];
  fameRange: [number, number];
  distance: [number, number];
  interests: string[];
  sort: "age" | "distance" | "fame_rating" | "interests";
}

interface ExploreContextType {
  filters: SearchFilters;
  setFilters: (
    // eslint-disable-next-line no-unused-vars
    filters: SearchFilters | ((prev: SearchFilters) => SearchFilters),
  ) => void;
}

interface Props {
  children: ReactNode;
}

const ExploreContext = createContext<ExploreContextType | null>(null);

export const ExploreProvider = ({ children }: Props) => {
  const [filters, setFilters] = useState<SearchFilters>({
    ageRange: [18, 100],
    fameRange: [1, 5],
    distance: [0, 1000],
    interests: [],
    sort: "distance",
  });

  const values = {
    filters,
    setFilters,
  };

  return (
    <ExploreContext.Provider value={values}>{children}</ExploreContext.Provider>
  );
};

export const useExploreContext = () => {
  const context = useContext(ExploreContext);

  if (!context) {
    throw new Error("context must be use within the context provider");
  }

  return context;
};
