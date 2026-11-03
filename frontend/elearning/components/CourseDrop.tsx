import request from "@/app/axios/axios";
import * as api from "@/app/axios/axios";
import { LectureDto } from "@/app/dtos/lecture.dto";
import { QuizDto } from "@/app/dtos/quiz.dto";
import { SectionProgressDto, formatClock, formatGrade } from "@/app/dtos/progress.dto";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, FileText } from "lucide-react";
import LastAttempt from "./answerRecoil";

const REPORT_EVERY_MS = 10_000; // how often the playback position is saved while a video plays
const COMPLETE_AT = 0.9; // a lecture counts as watched once 90% has been played

type LectureItemProps = {
  lecture: LectureDto;
  state?: { completed: boolean; positionSeconds: number };
  onChange: () => void;
};

function LectureItem({ lecture, state, onChange }: LectureItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastReport = useRef(0);
  const reportedDone = useRef(Boolean(state?.completed));
  const [completed, setCompleted] = useState(Boolean(state?.completed));
  const [resumedAt, setResumedAt] = useState<number | null>(null);

  useEffect(() => {
    reportedDone.current = Boolean(state?.completed);
    setCompleted(Boolean(state?.completed));
  }, [state?.completed]);

  const report = async (finished: boolean) => {
    const position = Math.floor(videoRef.current?.currentTime ?? 0);
    if (finished) {
      if (reportedDone.current) return;
      reportedDone.current = true; // set first so the 90% mark and "ended" do not both fire
    }
    try {
      await api.put(`/progress/lecture/${lecture.id}`, { positionSeconds: position, completed: finished });
      if (finished) {
        setCompleted(true);
        onChange();
      }
    } catch (error) {
      if (finished) reportedDone.current = false;
      console.log("Could not save lecture progress", error);
    }
  };

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    const saved = state?.positionSeconds ?? 0;
    // resume where the student stopped, unless they had already finished it or it was almost over
    if (video && !state?.completed && saved > 5 && saved < video.duration - 5) {
      video.currentTime = saved;
      setResumedAt(saved);
    }
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const now = Date.now();
    if (now - lastReport.current > REPORT_EVERY_MS) {
      lastReport.current = now;
      report(false);
    }
    if (!reportedDone.current && video.currentTime / video.duration >= COMPLETE_AT) report(true);
  };

  return (
    <div className="rounded-[10px] border border-bk-line p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-base font-semibold text-bk-ink">{lecture.name}</p>
        {completed ? (
          <span className="badge shrink-0 bg-emerald-50 text-[#1F8A5B]">
            <Check className="h-3 w-3" /> ĐÃ HỌC
          </span>
        ) : (
          <button type="button" className="shrink-0 text-xs text-bk-blue hover:text-bk-navy" onClick={() => report(true)}>
            Đánh dấu đã học
          </button>
        )}
      </div>

      <video
        ref={videoRef}
        controls
        className="mt-4 block w-full rounded-md border border-bk-line bg-bk-ink"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPause={() => !completed && report(false)}
        onEnded={() => report(true)}
      >
        <source src={lecture.material} type="video/mkv" />
        <source src={lecture.material?.replace(".mkv", ".mp4")} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      {resumedAt !== null && !completed && (
        <p className="mt-2 font-mono text-[11px] text-bk-slate">Tiếp tục từ {formatClock(resumedAt)}</p>
      )}

      {lecture.reference && (
        <a
          href={lecture.reference}
          target="_blank"
          rel="noopener noreferrer"
          className="button-link mt-3 text-xs"
        >
          <FileText className="h-3.5 w-3.5" /> Tải tài liệu
        </a>
      )}
    </div>
  );
}

type CourseDropdownProps = {
  title: string;
  sectionId: number | string;
  description?: string;
  userId?: string;
  progress?: SectionProgressDto;
  open: boolean;
  onToggle: () => void;
  onProgressChange?: () => void;
};

function CourseDropdown(props: CourseDropdownProps) {
  const [isWatchLastAttemp, setIsWatchLastAttemp] = useState(false);
  const [selectQuizId, setSelectQuizId] = useState<number>(0);
  const [selectQuizName, setSelectQuizName] = useState<string>("");
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [quizes, setQuizes] = useState<QuizDto[]>([]);
  const router = useRouter();

  const isIntro = props.sectionId === "" || props.title === "Giới thiệu";

  useEffect(() => {
    if (isIntro || !props.open || !props.userId || lectures.length + quizes.length > 0) return;
    request
      .get(`/lecture/section/${props.sectionId}`)
      .then((response) => setLectures(response.data.data || []))
      .catch(() => setLectures([]));
    request
      .get(`/quiz/section/${props.sectionId}`)
      .then((response) => setQuizes(Array.isArray(response.data) ? response.data : response.data?.data || []))
      .catch(() => setQuizes([]));
  }, [props.open, props.sectionId, props.userId]);

  const lecturesDone = props.progress?.lectures.filter((l) => l.completed).length ?? 0;
  const lectureTotal = props.progress?.lectures.length ?? 0;
  const quizTotal = props.progress?.quizzes.length ?? 0;
  const quizDone = props.progress?.quizzes.filter((q) => q.attemptsUsed > 0).length ?? 0;
  const sectionDone = lectureTotal + quizTotal > 0 && lecturesDone + quizDone === lectureTotal + quizTotal;

  return (
    <div id={isIntro ? undefined : `section-${props.sectionId}`} className="border-b border-bk-line last:border-b-0">
      {isWatchLastAttemp && (
        <LastAttempt onClose={() => setIsWatchLastAttemp(false)} quizId={selectQuizId} quizName={selectQuizName} />
      )}

      <button
        type="button"
        aria-expanded={props.open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-bk-navy"
        onClick={props.onToggle}
      >
        <span className="flex items-center gap-3">
          {!isIntro && (
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                sectionDone ? "border-[#1F8A5B] bg-[#1F8A5B] text-white" : "border-bk-line text-transparent"
              }`}
            >
              <Check className="h-3 w-3" />
            </span>
          )}
          <span className="font-display text-base font-semibold text-bk-ink">{props.title}</span>
        </span>
        <span className="flex items-center gap-3">
          {!isIntro && lectureTotal + quizTotal > 0 && (
            <span className="font-mono text-[11px] text-bk-slate">
              {lecturesDone + quizDone}/{lectureTotal + quizTotal}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-bk-slate transition-transform ${props.open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {props.open && (
        <div className="space-y-4 pb-6">
          {isIntro ? (
            <div className="rounded-[10px] bg-bk-mist p-5">
              <p className="text-sm leading-7 text-bk-slate">{props.description}</p>
              <p className="mt-3 text-sm text-bk-slate">
                Xem hết các bài giảng và làm quiz của từng chương. Hoàn thành 100% và đạt điểm trung bình quiz từ 5,0 để nhận chứng chỉ.
              </p>
            </div>
          ) : (
            <>
              {lectures.length === 0 && quizes.length === 0 && (
                <p className="text-sm text-bk-slate">Chương này chưa có nội dung.</p>
              )}

              {lectures.map((lecture) => (
                <LectureItem
                  key={lecture.id}
                  lecture={lecture}
                  state={props.progress?.lectures.find((l) => l.id === lecture.id)}
                  onChange={() => props.onProgressChange?.()}
                />
              ))}

              {quizes.length > 0 && (
                <div>
                  <p className="eyebrow">Quiz cuối chương</p>
                  <ul className="mt-3 space-y-3">
                    {quizes.map((quiz) => {
                      const state = props.progress?.quizzes.find((q) => q.id === quiz.id);
                      const used = state?.attemptsUsed ?? 0;
                      const remaining = Math.max(0, quiz.attempt - used);
                      return (
                        <li
                          key={quiz.id}
                          className="flex flex-col gap-4 rounded-[10px] border border-bk-line p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-bk-ink">{quiz.name}</p>
                            <p className="mt-1 text-sm text-bk-slate">
                              {used > 0 ? (
                                <>
                                  Điểm cao nhất <span className="font-semibold text-bk-ink">{formatGrade(state?.bestScore ?? null)}</span>/10 ·{" "}
                                </>
                              ) : (
                                "Chưa làm · "
                              )}
                              {remaining > 0 ? `còn ${remaining} lượt làm` : "đã hết lượt"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {used > 0 && (
                              <button
                                type="button"
                                className="button-secondary px-3 py-2 text-xs"
                                onClick={() => {
                                  setSelectQuizId(quiz.id);
                                  setSelectQuizName(quiz.name);
                                  setIsWatchLastAttemp(true);
                                }}
                              >
                                Xem lần gần nhất
                              </button>
                            )}
                            {remaining > 0 && (
                              <button
                                type="button"
                                className="button-primary px-3 py-2 text-xs"
                                onClick={() => router.push(`/quizzes?quiz=${encodeURIComponent(JSON.stringify(quiz))}`)}
                              >
                                {used === 0 ? "Làm bài ngay" : "Làm lại"}
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDropdown;
