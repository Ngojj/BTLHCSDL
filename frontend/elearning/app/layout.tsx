"use client";
import { Be_Vietnam_Pro, JetBrains_Mono, Lexend } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from "@react-oauth/google";

const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});
const fontDisplay = Lexend({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
        <html lang="vi">
          <body
            className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} antialiased min-h-screen`}
          >
            {children}
          </body>
        </html>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}
