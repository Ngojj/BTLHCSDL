import React, { useEffect, useState } from "react";
import request from "@/app/axios/axios";
import { OptionDto } from "@/app/dtos/option.dto";

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

  useEffect(() => {
    fetchOptions();
  }, [id]);

  return (
    <div>
      <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-bk-ink sm:text-[34px]">
        {question}
      </h2>

      <div className="mt-8 space-y-3" role="radiogroup">
        {options.map((option, index) => {
          const selected = selectedAnswer === option.option;
          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onAnswerSelect(id, option.option)}
              className={`flex w-full items-center gap-4 rounded-[10px] border px-4 py-4 text-left text-base transition-colors ${
                selected
                  ? "border-bk-navy bg-bk-mist text-bk-navy"
                  : "border-bk-line bg-white text-bk-ink hover:border-bk-navy/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs ${
                  selected ? "border-bk-navy bg-bk-navy text-white" : "border-bk-line text-bk-slate"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              {option.option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
