
"use client"
import { RoadmapShowForStudentDto } from "@/app/dtos/roadmap.dto";
import Roadmap from "@/components/Roadmap";
import { useSearchParams } from "next/navigation";


export default function Home() {
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