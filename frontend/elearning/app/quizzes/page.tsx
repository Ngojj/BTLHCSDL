"use client";
import React, { useEffect, useState } from "react";
import { QuestionDto } from "../dtos/question.dto";
import request from "../axios/axios";
import Quiz from "@/components/Quizz";
import { useSearchParams } from "next/navigation";
import { QuizDto } from "../dtos/quiz.dto";
import { useRecoilValue } from "recoil";
import { userLoginState } from "@/state";
import FillInTheBlank from "@/components/Fillinblank";

const Home = () => {
  const searchParams = useSearchParams();
  const quizParam = searchParams.get("quiz");
  const user = useRecoilValue(userLoginState);

  const quiz: QuizDto | null = quizParam ? JSON.parse(quizParam) : null;
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    try {
      const response = await request.get(`/question/quiz/${quiz?.id}`);
      setQuestions(response.data);
    } catch (error: any) {
      console.log(error);
      setQuestions([]);
    }
  };

  const handleAnswerSelect = async (questionId: number, selectedAnswer: string) => {
    try {
      const existAnswerRecord = await request.get(`/answerRecord/question/${questionId}/student/${user.id}`);
      if (existAnswerRecord.data.message === "Record not found by QuizId and StudentId") {
        await request.post(`/answerRecord/create`, {
          quizId: quiz?.id,
          studentId: user.id,
          questionId,
          studentAns: selectedAnswer,
        });
      } else {
        if (existAnswerRecord.data.data[0].studentAns !== selectedAnswer) {
          await request.patch(`/answerRecord/update`, {
            quizId: quiz?.id,
            studentId: user.id,
            questionId,
            studentAns: selectedAnswer,
          });
        }
      }

      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: selectedAnswer,
      }));
    } catch (e) {
      console.log(e);
      alert("Máy chủ đang gặp sự cố. Vui lòng thử lại.");
    }
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
    const confirm = window.confirm("Bạn có chắc muốn nộp bài?");
    if (!confirm) return;

    try {
      let numberOfCorrect = 0;

      for (const question of questions) {
        if (userAnswers[question.id] === question.answer) {
          numberOfCorrect += 1;
        }
      }

      const calculatedScore = (numberOfCorrect / questions.length) * 10;
      setScore(calculatedScore);

      const dOResponse = await request.get(`/dO/quiz/${quiz?.id}/student/${user.id}`);
      await request.post(`/dO/create`, {
        quizId: quiz?.id,
        studentId: user.id,
        score: calculatedScore,
        attemptOrder: dOResponse.data.data.length + 1,
      });

      setIsPopupOpen(true);
    } catch (error) {
      alert("Máy chủ xảy ra lỗi. Vui lòng thử lại.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <main className="section-shell py-10 sm:py-14">
      <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Quiz Session
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              {quiz?.name || "Làm quiz"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Trả lời lần lượt từng câu hỏi và theo dõi tiến độ làm bài trong một giao diện tập trung hơn.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Câu hiện tại</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {questions.length > 0 ? currentQuestionIndex + 1 : 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tổng câu hỏi</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{questions.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-full bg-slate-100 p-1">
          <div
            className="h-2.5 rounded-full bg-sky-700 transition-all"
            style={{
              width: `${questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%`,
            }}
          />
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
          {currentQuestion && (
            currentQuestion.type === 'multiple choice' ? (
              <Quiz
                id={currentQuestion.id}
                question={currentQuestion.content}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={userAnswers[currentQuestion.id] || ""}
              />
            ) : (
              <FillInTheBlank
                id={currentQuestion.id}
                question={currentQuestion.content}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={userAnswers[currentQuestion.id] || ""}
              />
            )
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handlePrevious}
            className="button-secondary"
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </button>
          <p className="text-sm font-medium text-slate-500">
            Câu hỏi {questions.length > 0 ? currentQuestionIndex + 1 : 0}/{questions.length}
          </p>
          <button
            onClick={handleNext}
            className="button-primary"
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Câu tiếp theo
          </button>
        </div>

        {currentQuestionIndex === questions.length - 1 && questions.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              className="rounded-2xl border border-sky-200 bg-sky-50 px-6 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Nộp bài
            </button>
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-2xl">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Quiz Completed
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Kết quả của bạn</h2>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Điểm số</p>
              <p className="mt-2 text-5xl font-semibold text-sky-700">{score.toFixed(2)}</p>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Kết quả đã được lưu. Bạn có thể quay lại khóa học để tiếp tục học hoặc xem lại tiến độ.
            </p>
            <button
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
      )}
    </main>
  );
};

export default Home;
