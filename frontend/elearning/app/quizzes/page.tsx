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
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái pop-up
  const [score, setScore] = useState(0); // Điểm số

  const fetchQuestions = async () => {
    try {
      const response = await request.get(`/question/quiz/${quiz?.id}`);
      setQuestions(response.data);
    } catch (error: any) {
      console.log(error);
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
      alert("Server đang gặp sự cố! Vui lòng thử lại!");
    }
  };

  const handleNext = () => {
    if (!userAnswers[currentQuestion.id]) {
      alert("Vui lòng chọn câu trả lời trước khi sang câu tiếp theo!");
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
      let numberOfCorrect: number = 0;

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
      alert("Server xảy ra lỗi! Vui lòng thử lại!");
      console.log(error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-blue-500">
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
          selectedAnswer={userAnswers[currentQuestion.id] || ""}/>
        )
      )}
      <div className="flex items-center justify-between w-full max-w-3xl bg-white py-2 px-2">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:scale-110 active:scale-90"
          disabled={currentQuestionIndex === 0}
        >
          Trang trước
        </button>
        <div>
          <p>Câu hỏi: {currentQuestionIndex + 1}/{questions.length}</p>
        </div>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:scale-110 active:scale-90"
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Trang tiếp
        </button>
      </div>
      {currentQuestionIndex === questions.length - 1 && (
        <div className="bg-white w-full max-w-3xl flex items-center justify-center pb-2">
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 text-blue-500 border-2 border-blue-500 rounded-lg hover:scale-110 active:scale-90"
          >
            Gửi bài
          </button>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-3xl shadow-2xl w-full max-w-md text-white text-center">
            <div className="bg-white text-black rounded-lg p-6 shadow-inner mb-6">
              <p className="text-lg">Điểm số của bạn:</p>
              <span className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                {score}
              </span>
            </div>
            <p className="text-sm italic mb-4">Hãy cố gắng hơn nữa nhé, bạn đang làm rất tốt!</p>
            <button
              onClick={() => {
                setIsPopupOpen(false);
                window.history.back();
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:scale-110 active:scale-95 transform transition-transform duration-200"
            >
              Thoát
            </button>
          </div>
        </div>
      
      )}
    </div>
  );
};

export default Home;
