"use client";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type variantType =
  | "default"
  | "outline"
  | "destructive"
  | "secondary"
  | "ghost"
  | "link";

type ButtonWithIconProps = {
  children: ReactNode;
  variant?: variantType;
  onClick?: () => void;
};

export function ButtonWithIcon({
  children,
  variant,
  onClick,
}: ButtonWithIconProps) {
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
}
