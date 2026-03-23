
"use client"
import { RoadmapShowForStudentDto } from "@/app/dtos/roadmap.dto";
import Roadmap from "@/components/Roadmap";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


function RoadmapDetailContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("roadmap");

  const roadmap: RoadmapShowForStudentDto | null = courseParam
    ? JSON.parse(courseParam)
    : null;
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 min-h-screen">
      <main>
        <Roadmap roadmap={roadmap}/>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700" />}>
      <RoadmapDetailContent />
    </Suspense>
  );
}
