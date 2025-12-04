"use client"; 
import localFont from "next/font/local";
import "./globals.css";
import { RecoilRoot, useRecoilState } from "recoil";
import { useEffect } from "react";
import { userLoginState } from "@/state";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RecoilRoot>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          {children}
        </body>
      </html>
    </RecoilRoot>
  );
}
