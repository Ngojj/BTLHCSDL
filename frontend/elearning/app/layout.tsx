"use client";
import localFont from "next/font/local";
import "./globals.css";
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from "@react-oauth/google";

const fontSans = localFont({
  src: [
    { path: "./fonts/BeVietnamPro-Regular.woff", weight: "400" },
    { path: "./fonts/BeVietnamPro-Medium.woff", weight: "500" },
    { path: "./fonts/BeVietnamPro-SemiBold.woff", weight: "600" },
    { path: "./fonts/BeVietnamPro-Bold.woff", weight: "700" },
  ],
  variable: "--font-sans",
});
const fontDisplay = localFont({
  src: "./fonts/Lexend.woff",
  variable: "--font-display",
  weight: "100 900",
});
const fontMono = localFont({
  src: "./fonts/JetBrainsMono.woff",
  variable: "--font-mono",
  weight: "100 800",
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
