"use client";

import React from "react";
import BKNavbar2 from "@/components/BKNavbar2";
import Footer from "@/components/Footer";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BKNavbar2 />
      <div className="min-h-screen flex-grow bg-white">
        {children}
      </div>
      <Footer />
    </>
  );
}
