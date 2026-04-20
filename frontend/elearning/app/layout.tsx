"use client"; 
import localFont from "next/font/local";
import "./globals.css";
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <RecoilRoot>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
          >
            {children}
          </body>
        </html>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}
