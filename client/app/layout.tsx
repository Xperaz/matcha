import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "./utils/providers/ReactQueryProvider";
import React from "react";
import { readex_pro } from "./utils/fonts";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "matcha",
  description: "matcha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${readex_pro} `}>
        <ReactQueryProvider>
          <main className="font-readex-pro">{children}</main>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
