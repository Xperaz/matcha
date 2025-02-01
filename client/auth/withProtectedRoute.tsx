"use client";
import { ComponentType, PropsWithChildren, useEffect } from "react";
import { useAuthData } from "./useAuthData";
import { usePathname, useRouter } from "next/navigation";
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
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Verifying authentication...
            </p>
          </div>
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
