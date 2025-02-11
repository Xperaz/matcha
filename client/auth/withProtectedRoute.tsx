"use client";
import { ComponentType, PropsWithChildren, useEffect } from "react";
import { useAuthData } from "./useAuthData";
import { usePathname, useRouter } from "next/navigation";
import LoadingOverlay from "@/components/organisms/common/LoadingOverlay";

export interface WithProtectedRouteProps extends PropsWithChildren {
  isLoading?: boolean;
  userData?: any;
  isAuthenticated?: boolean;
}

const withProtectedRoute = <P extends WithProtectedRouteProps>(
  Component: ComponentType<P>,
) => {
  const Enhanced = (props: P) => {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading, userData } = useAuthData();

    useEffect(() => {
      if (!isAuthenticated && !isLoading) {
        router.replace("/login");
      }

      if (isAuthenticated && !isLoading && userData) {
        if (
          userData?.email_verified === false &&
          pathname !== "/confirm-email"
        ) {
          router.replace("/confirm-email");
        }
        if (!userData?.profile_completed && userData?.email_verified) {
          router.replace("/complete-profile");
        }
      }
    }, [isAuthenticated, isLoading, router, userData, pathname]);

    if (isLoading) {
      return <LoadingOverlay />;
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
