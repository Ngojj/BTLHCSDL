import request from '@/app/axios/axios';
import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

type ReviewQuestion = {
  id: number;
  content: string;
  studentAnswer: string | null;
  isCorrect: boolean;
  correctAnswer?: string;
};

type Review = {
  latestScore: number;
  attempts: { used: number; allowed: number };
  answersRevealed: boolean;
  questions: ReviewQuestion[];
};

// Review of the latest attempt, graded by the server. Correct answers are only shown once no attempts are left.
function LastAttempt(props: any) {
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request
      .get(`/quiz/${props.quizId}/review`)
      .then((response) => setReview(response.data))
      .catch((e) => setError(e?.response?.data?.message || 'Không thể tải kết quả lần làm gần nhất.'));
  }, [props.quizId]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-bk-ink/50 px-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-[10px] border border-bk-line bg-white">
        <div className="border-b border-bk-line p-6">
          <p className="eyebrow">Lần làm gần nhất</p>
          <h3 className="mt-1 text-xl font-semibold text-bk-ink">{props.quizName}</h3>
          {review && (
            <p className="mt-2 text-sm text-bk-slate">
              Điểm <span className="font-semibold text-bk-ink">{review.latestScore.toFixed(2).replace('.', ',')}</span>/10 ·
              đã dùng {review.attempts.used}/{review.attempts.allowed} lượt
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && <p className="text-sm text-[#C2410C]">{error}</p>}
          {!review && !error && <p className="text-sm text-bk-slate">Đang tải...</p>}
          {review && (
            <ol className="space-y-5">
              {review.questions.map((question, index) => (
                <li key={question.id}>
                  <p className="text-sm font-semibold text-bk-ink">
                    <span className="mr-2 font-mono text-xs text-bk-blue">{String(index + 1).padStart(2, '0')}</span>
                    {question.content}
                  </p>
                  <p className={`mt-1.5 flex items-start gap-2 text-sm ${question.isCorrect ? 'text-[#1F8A5B]' : 'text-[#C2410C]'}`}>
                    {question.isCorrect ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
                    <span>{question.studentAnswer ?? 'Chưa trả lời'}</span>
                  </p>
                  {review.answersRevealed && !question.isCorrect && (
                    <p className="mt-1 pl-6 text-sm text-bk-slate">
                      Đáp án đúng: <span className="font-medium text-bk-ink">{question.correctAnswer}</span>
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
          {review && !review.answersRevealed && (
            <p className="mt-6 border-t border-bk-line pt-4 text-xs text-bk-slate">
              Đáp án đúng sẽ hiển thị sau khi bạn dùng hết lượt làm bài.
            </p>
          )}
        </div>

        <div className="flex justify-end border-t border-bk-line p-4">
          <button type="button" onClick={props.onClose} className="button-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default LastAttempt;
