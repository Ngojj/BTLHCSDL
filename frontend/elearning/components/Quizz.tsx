import React, { useCallback, useEffect, useState } from "react";
import request from "@/app/axios/axios";
import { OptionDto } from "@/app/dtos/option.dto";
import { useRouter } from "next/navigation";

export type QuizProps = {
  id: number;
  question: string;
  onAnswerSelect: (questionId: number, selectedAnswer: string) => void;
  selectedAnswer: string; 
};

const Quiz: React.FC<QuizProps> = ({
  id,
  question,
  onAnswerSelect,
  selectedAnswer,
}) => {
  const [options, setOptions] = useState<OptionDto[]>([]);

  const fetchOptions = async () => {
    try {
      const response = await request.get(`/option/id/${id}`);
      setOptions(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuit = () => {
    const confirm = window.confirm(
      "Câu trả lời của bạn sẽ không được lưu.\nBạn có chắc chắn muốn thoát khỏi chế độ làm bài?"
    );

    if (!confirm) return;

    window.history.back();
  };

  useEffect(() => {
    fetchOptions();
  }, [id]);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="px-4 py-2 border rounded-lg border-red-500 text-red-500">
            Đáp án đã chọn:{" "}
            <span className="font-semibold">
              {selectedAnswer || "Chưa chọn"}
            </span>
          </div>
          <button 
          type="button"
          className="border-2 border-blue-500 px-5 py-2 rounded-xl text-blue-500"
          onClick={() => handleQuit()}>
            Thoát
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-gray-700 mb-6">
          <p className="text-lg font-medium">{question}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(id, option.option)}
              className={`px-4 py-2 rounded-lg shadow-md text-white font-semibold ${
                selectedAnswer === option.option
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } focus:outline-none`}
            >
              {option.option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
