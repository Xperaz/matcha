"use client";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type variantType =
  | "default"
  | "outline"
  | "destructive"
  | "secondary"
  | "ghost"
  | "link"
  | "light";

type ButtonWithIconProps = {
  children: ReactNode;
  variant?: variantType;
  onClick?: () => void;
  className?: string;
};

export function ButtonWithIcon({
  children,
  variant,
  onClick,
  className,
}: ButtonWithIconProps) {
  return (
    <Button variant={variant} onClick={onClick} className={className}>
      {children}
    </Button>
  );
}
