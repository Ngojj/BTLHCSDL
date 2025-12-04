"use client";
import React, { useState } from "react";
import { QuizProps } from "./Quizz";


const FillInTheBlank: React.FC<QuizProps> = ({
  id,
  question,
  onAnswerSelect,
  selectedAnswer,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [state, setState] = useState<boolean>(false)

  const handleBlockedButton = async () => {
    setState(!state)
  }

  const handleUnblockedButtion = async () => {
    if(!userAnswer){
      alert("Không thể khóa khi chưa nhập câu trả lời của bạn")
      return
    }
    setState(!state)
    onAnswerSelect(id, userAnswer)
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="px-4 py-2 border rounded-lg border-red-500 text-red-500">
            Câu trả lời:{" "}
            <span className="font-semibold">{selectedAnswer || "Chưa nhập"}</span>
          </div>
          {/* <div className="px-4 py-2 border rounded-lg border-red-500 text-red-500">
            Thời gian còn lại: {timeLeft}
          </div> */}
          
        </div>
        <p className="text-sm text-gray-300"><i>Vui lòng nhấn "Khóa" khi thực hiện xong câu hỏi, nếu không kết quả sẽ không được lưu</i></p>
        <div className="bg-gray-100 p-4 rounded-lg text-gray-700 mb-6">
          <p className="text-lg font-medium">{question}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhập câu trả lời:
          </label>
          <div className="flex justify-center items-center">
            <input
              type="text"
              disabled={state}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={state? "Không thể nhập câu trả lời khi đã khóa!" : "Nhập câu trả lời của bạn"}
            />
            <button
              type="button"
              className={`py-2 border-2 ${state ? "border-red-500 text-red-500" : "border-blue-500 text-blue-500"} hover:scale-110 active scale-90 w-32 rounded-xl`}
              onClick={() => {
                state ? handleBlockedButton() : handleUnblockedButtion()
              }}>
                {state ? "Mở khóa" : "Khóa"}
            </button>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default FillInTheBlank;
