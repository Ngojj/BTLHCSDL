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
      <div className="flex-grow bg-slate-50 min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  );
}
