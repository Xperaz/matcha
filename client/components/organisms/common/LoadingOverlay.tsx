import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader } from "lucide-react";

/*
 * LoadingOverlay component is used to display a loading overlay when the user is being authenticated.
 * This approach help to avoid scroll interference issues with the browser.
 */

const LoadingOverlay = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const overlayContent = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      aria-live="polite"
      role="status"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative flex flex-col items-center gap-2">
        <Loader className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Verifying authentication...
        </p>
      </div>
    </div>
  );

  // Only render in browser, not during SSR
  if (!mounted) return null;

  return createPortal(overlayContent, document.body);
};

export default LoadingOverlay;
