"use client";
import React, { Suspense, useEffect, useState } from "react";
import { QuestionDto } from "../dtos/question.dto";
import request from "../axios/axios";
import Quiz from "@/components/Quizz";
import { useSearchParams } from "next/navigation";
import { QuizDto } from "../dtos/quiz.dto";
import { useRecoilValue } from "recoil";
import { userLoginState } from "@/state";
import FillInTheBlank from "@/components/Fillinblank";
import { ArrowLeft, ArrowRight, Check, Clock, Flag } from "lucide-react";

const QuizPageContent = () => {
  const searchParams = useSearchParams();
  const quizParam = searchParams.get("quiz");
  const user = useRecoilValue(userLoginState);

  const quiz: QuizDto | null = quizParam ? JSON.parse(quizParam) : null;
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [flagged, setFlagged] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number; remaining: number } | null>(null);

  const fetchQuestions = async () => {
    try {
      const response = await request.get(`/question/quiz/${quiz?.id}`);
      setQuestions(response.data);
    } catch (error: any) {
      console.log(error);
      setQuestions([]);
    }
  };

  // Answers stay in the browser until the quiz is submitted; the server grades them.
  const handleAnswerSelect = async (questionId: number, selectedAnswer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (!currentQuestion || !userAnswers[currentQuestion.id]) {
      alert("Vui lòng chọn câu trả lời trước khi sang câu tiếp theo.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const unanswered = questions.filter((question) => !userAnswers[question.id]).length;
    const confirmed = window.confirm(
      unanswered > 0 ? `Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?` : "Bạn có chắc muốn nộp bài?"
    );
    if (!confirmed) return;

    try {
      setSubmitting(true);
      const answers: { [key: string]: string } = {};
      for (const [questionId, answer] of Object.entries(userAnswers)) answers[questionId] = answer;

      // the server compares with the stored answers and records the attempt; the client never sends a score
      const result = await request.post(`/quiz/${quiz?.id}/submit`, { answers });
      setScore(result.data.score);
      setResult({ correct: result.data.correct, total: result.data.total, remaining: result.data.remainingAttempts });
      setIsPopupOpen(true);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Máy chủ xảy ra lỗi. Vui lòng thử lại.");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) =>
      prev.includes(questionId) ? prev.filter((item) => item !== questionId) : [...prev, questionId]
    );
  };

  const handleQuit = () => {
    const confirm = window.confirm(
      "Câu trả lời của bạn sẽ không được lưu.\nBạn có chắc chắn muốn thoát khỏi chế độ làm bài?"
    );
    if (!confirm) return;
    window.history.back();
  };

  // Chỉ cho nhảy tới câu đã mở (mọi câu trước đó đã trả lời)
  const canJumpTo = (index: number) =>
    questions.slice(0, index).every((question) => Boolean(userAnswers[question.id]));

  const answeredCount = questions.filter((question) => userAnswers[question.id]).length;
  const isLast = currentQuestionIndex === questions.length - 1 && questions.length > 0;
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-bk-line bg-white">
        <div className="section-shell flex h-16 items-center justify-between gap-4">
          <button type="button" onClick={handleQuit} className="inline-flex items-center gap-2 text-sm text-bk-slate hover:text-bk-ink">
            <ArrowLeft className="h-4 w-4" /> Thoát
          </button>
          <p className="truncate text-center font-mono text-[11px] uppercase tracking-[0.16em] text-bk-slate">
            {quiz?.name || "Làm quiz"}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-bk-line px-2.5 py-1.5 font-mono text-xs text-bk-ink">
            <Clock className="h-3.5 w-3.5 text-bk-blue" />
            {quiz?.duration ? `${quiz.duration} phút` : "--:--"}
          </span>
        </div>
        <div className="flex gap-0.5">
          {questions.map((question, index) => (
            <span
              key={question.id}
              className={`h-1 flex-1 ${
                index === currentQuestionIndex
                  ? "bg-bk-blue"
                  : userAnswers[question.id]
                  ? "bg-bk-navy"
                  : "bg-bk-line"
              }`}
            />
          ))}
        </div>
      </header>

      <main className="section-shell grid gap-10 py-12 lg:grid-cols-[1fr_280px]">
        <section className="max-w-3xl">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-bk-blue">
              Câu <span className="text-xl text-bk-navy">{pad(questions.length > 0 ? currentQuestionIndex + 1 : 0)}</span> / {pad(questions.length)}
            </p>
            {currentQuestion && (
              <button
                type="button"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                  flagged.includes(currentQuestion.id)
                    ? "border-bk-gold bg-[#FFFBEF] text-[#8A6D12]"
                    : "border-bk-line text-bk-slate hover:border-bk-navy hover:text-bk-ink"
                }`}
              >
                <Flag className="h-3.5 w-3.5" strokeWidth={1.5} />
                {flagged.includes(currentQuestion.id) ? "Đã đánh dấu" : "Đánh dấu xem lại"}
              </button>
            )}
          </div>

          <div className="mt-8">
            {currentQuestion ? (
              currentQuestion.type === "multiple choice" ? (
                <Quiz
                  id={currentQuestion.id}
                  question={currentQuestion.content}
                  onAnswerSelect={handleAnswerSelect}
                  selectedAnswer={userAnswers[currentQuestion.id] || ""}
                />
              ) : (
                <FillInTheBlank
                  key={currentQuestion.id}
                  id={currentQuestion.id}
                  question={currentQuestion.content}
                  onAnswerSelect={handleAnswerSelect}
                  selectedAnswer={userAnswers[currentQuestion.id] || ""}
                />
              )
            ) : (
              <div className="space-y-3">
                <div className="h-9 w-3/4 animate-pulse rounded bg-bk-mist" />
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-14 animate-pulse rounded-[10px] border border-bk-line bg-bk-mist" />
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-bk-line pt-6">
            <button
              type="button"
              onClick={handlePrevious}
              className="button-secondary"
              disabled={currentQuestionIndex === 0}
            >
              Câu trước
            </button>
            {isLast ? (
              <button type="button" onClick={handleSubmit} disabled={submitting} className="button-primary">
                {submitting ? "Đang chấm..." : "Nộp bài"} <Check className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="button-primary"
                disabled={!currentQuestion || !userAnswers[currentQuestion.id]}
              >
                Câu tiếp theo <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        <aside className="h-fit rounded-[10px] border border-bk-line bg-bk-mist/60 p-5 lg:sticky lg:top-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bk-slate">Bản đồ câu hỏi</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const current = index === currentQuestionIndex;
              const answered = Boolean(userAnswers[question.id]);
              const isFlagged = flagged.includes(question.id);
              return (
                <button
                  key={question.id}
                  type="button"
                  disabled={!canJumpTo(index)}
                  onClick={() => setCurrentQuestionIndex(index)}
                  aria-label={`Câu ${index + 1}`}
                  className={`relative flex aspect-square items-center justify-center rounded-md border font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    answered ? "border-bk-navy bg-bk-navy text-white" : "border-bk-line bg-white text-bk-ink"
                  } ${current ? "ring-2 ring-bk-blue ring-offset-1" : ""}`}
                >
                  {pad(index + 1)}
                  {isFlagged && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-bk-gold" />}
                </button>
              );
            })}
          </div>

          <ul className="mt-5 space-y-2 text-sm text-bk-slate">
            <li className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-bk-navy" /> Đã trả lời · <span className="text-bk-ink">{answeredCount}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-[2px] border border-bk-line bg-white" /> Chưa trả lời · <span className="text-bk-ink">{questions.length - answeredCount}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-bk-gold" /> Đánh dấu xem lại · <span className="text-bk-ink">{flagged.length}</span>
            </li>
          </ul>

          <div className="mt-5 flex justify-between border-t border-bk-line pt-4 text-sm">
            <span className="text-bk-slate">Thang điểm</span>
            <span className="font-mono text-xs text-bk-ink">
              {questions.length > 0 ? `${(10 / questions.length).toFixed(1).replace(".", ",")} điểm / câu` : "—"}
            </span>
          </div>
        </aside>
      </main>

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bk-ink/50 px-4">
          <div className="w-full max-w-sm overflow-hidden rounded-[10px] border border-bk-line bg-white text-center">
            <div className="bp-grid-dark bg-bk-navy px-8 py-10 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">Kết quả của bạn</p>
              <p className="mt-4 font-display text-7xl font-semibold">
                {score.toFixed(1).replace(".", ",")}
                <span className="text-2xl text-white/60">/10</span>
              </p>
              {score === 10 && (
                <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-bk-gold">★ ĐIỂM TỐI ĐA</p>
              )}
            </div>
            <div className="p-7">
              <p className="text-sm leading-6 text-bk-slate">
                Đúng {result?.correct ?? 0}/{result?.total ?? questions.length} câu. Kết quả đã được lưu vào bảng điểm{result && result.remaining > 0 ? ` — bạn còn ${result.remaining} lượt làm lại.` : "."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsPopupOpen(false);
                  window.history.back();
                }}
                className="button-primary mt-6 w-full"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<main className="section-shell py-12 text-sm text-bk-slate">Đang tải bài quiz...</main>}>
      <QuizPageContent />
    </Suspense>
  );
}
