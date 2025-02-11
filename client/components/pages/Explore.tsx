"use client";
import { ExploreProvider } from "@/context/exploreContext";
import withAppLayout from "../templates/layout/withAppLayout";
import withProtectedRoute from "@/auth/withProtectedRoute";

import ExploreSearch from "../organisms/explore/ExploreSearch";

const Explore = () => {
  return (
    <ExploreProvider>
      <ExploreSearch />
    </ExploreProvider>
  );
};

export default withAppLayout(withProtectedRoute(Explore));
