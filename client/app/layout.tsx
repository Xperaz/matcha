import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "./utils/providers/ReactQueryProvider";
import React from "react";
import { readex_pro } from "./utils/fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
        </ReactQueryProvider>
      </body>
    </html>
  );
}
