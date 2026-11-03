// Shapes returned by GET /progress/course/:id and the /certificate endpoints.

export interface LectureProgressDto {
  id: number;
  name: string;
  completed: boolean;
  positionSeconds: number;
}

export interface QuizProgressDto {
  id: number;
  name: string;
  attemptsUsed: number;
  attemptsAllowed: number;
  bestScore: number | null;
}

export interface SectionProgressDto {
  id: number;
  name: string;
  lectures: LectureProgressDto[];
  quizzes: QuizProgressDto[];
}

export interface NextStepDto {
  type: "lecture" | "quiz";
  id: number;
  name: string;
  sectionId: number;
  sectionName: string;
  positionSeconds: number;
}

export interface CourseProgressDto {
  courseId: number;
  progress: number;
  gpa: number | null;
  completed: boolean;
  passGpa: number;
  totals: { lectures: number; lecturesDone: number; quizzes: number; quizzesDone: number };
  sections: SectionProgressDto[];
  next: NextStepDto | null;
  certificate: { code: string; issuedAt: string } | null;
}

export interface CertificateDto {
  code: string;
  courseId: number;
  courseName: string;
  studentName: string;
  teacherName: string;
  issuedAt: string; // YYYY-MM-DD
  grade: number | null;
}

/** 125 -> "2:05" */
export const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

/** "2026-11-02" -> "02/11/2026" */
export const formatIsoDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export const formatGrade = (grade: number | null) => (grade === null ? "—" : grade.toFixed(1).replace(".", ","));

/** A section is finished when all its lectures are watched and every quiz has been attempted. */
export const isSectionDone = (section: SectionProgressDto) =>
  section.lectures.every((l) => l.completed) && section.quizzes.every((q) => q.attemptsUsed > 0);
