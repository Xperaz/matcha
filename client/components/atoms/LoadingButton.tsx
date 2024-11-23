import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export type ButtonLoadingProps = {
  title: string;
};

export function ButtonLoading({ title }: ButtonLoadingProps) {
  return (
    <Button disabled variant="outline">
      <Loader2 className="animate-spin" />
      {title}
    </Button>
  );
}
