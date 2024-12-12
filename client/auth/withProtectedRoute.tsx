"use client";
import { ComponentType, PropsWithChildren, useEffect, useState } from "react";
import { useAuthData } from "./useAuthData";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export interface WithProtectedRouteProps extends PropsWithChildren {
  isLoading?: boolean;
  userData?: any;
  isAuthenticated?: boolean;
}

const withProtectedRoute = <P extends WithProtectedRouteProps>(
  Component: ComponentType<P>,
) => {
  const Enhanced = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, userData } = useAuthData();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
      if (!isAuthenticated && !isLoading) {
        router.push("/login");
      }

      // TODO: redirect to complete profile page if user profile is not completed
      if (isAuthenticated && !isLoading) {
        setShowContent(true);
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !showContent) {
      // TODO: add animated Loader
      return (
        <div className="fixed inset-0 flex items-center justify-center z-999 bg-pink-100">
          <Loader />
        </div>
      );
    }

    if (!isAuthenticated) {
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
