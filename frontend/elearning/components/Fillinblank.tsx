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
    <div>
      <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-bk-ink sm:text-[34px]">
        {question}
      </h2>

      <label className="mt-8 block text-xs text-bk-slate" htmlFor={`answer-${id}`}>
        Câu trả lời của bạn
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={`answer-${id}`}
          type="text"
          disabled={state}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="input-field disabled:bg-bk-mist disabled:text-bk-slate"
          placeholder={state ? "Đã khóa câu trả lời" : "Nhập câu trả lời rồi nhấn Khóa"}
        />
        <button
          type="button"
          className={state ? "button-secondary w-32" : "button-primary w-32"}
          onClick={() => {
            if (state) {
              handleBlockedButton();
              return;
            }
            handleUnblockedButtion();
          }}>
            {state ? "Mở khóa" : "Khóa"}
        </button>
      </div>
      <p className="mt-3 text-xs text-bk-slate">
        Đã lưu: <span className="font-mono text-bk-ink">{selectedAnswer || "—"}</span> · Nhấn “Khóa” để lưu câu trả lời.
      </p>
    </div>
  );
};

export default FillInTheBlank;
