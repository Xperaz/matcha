"use client";
import { ButtonWithIcon } from "@/components/atoms/ButtonWithIcon";
import { ButtonLoading } from "@/components/atoms/LoadingButton";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto flex gap-4">
      <Button variant="default" onClick={() => alert("default")}>
        Primary
      </Button>
      <Button variant="outline" onClick={() => alert("outlined")}>
        Outlined
      </Button>
      <Button variant="destructive" onClick={() => alert("delete")}>
        Delete
      </Button>
      <ButtonLoading title="Send Request" />
      <ButtonWithIcon variant="link" onClick={() => alert("link")}>
        <Mail /> Login with Email
      </ButtonWithIcon>
    </div>
  );
}
