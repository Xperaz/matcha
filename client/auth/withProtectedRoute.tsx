"use client";
import { ComponentType, PropsWithChildren, useEffect } from "react";
import { useAuthData } from "./useAuthData";
import { useRouter } from "next/navigation";

export interface WithProtectedRouteProps extends PropsWithChildren {
  isLoading: boolean;
  userData: any;
  isAuthenticated: boolean;
}

const withProtectedRoute = <P extends WithProtectedRouteProps>(
  Component: ComponentType<P>,
) => {
  const Enhanced = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, userData } = useAuthData();

    useEffect(() => {
      if (!isAuthenticated && !isLoading) {
        router.push("/login");
      }
    }, [isAuthenticated, isLoading, router]);

    if (!isAuthenticated || isLoading) {
      // IMPROVE: We can add Loader here
      return null;
    }

    return (
      <Component
        {...(props as P)}
        {...{ isAuthenticated, isLoading, userData }}
      />
    );
  };

  return Enhanced;
};

export default withProtectedRoute;
