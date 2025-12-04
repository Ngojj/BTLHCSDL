import request from '@/app/axios/axios';
import { QuestionDto } from '@/app/dtos/question.dto';
import { userLoginState } from '@/state';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

function LastAttempt(props: any) {
    const user = useRecoilValue(userLoginState)
    const [questions, setQuestions] = useState<QuestionDto[]>([]) 
    const [answerRecord, setAnswerRecord] = useState<{ [key: string] : string}>({})
  const fetchAnswerRecordAndQuizQuestion = async () => {
    try {
        const response = await request.get(`/question/quiz/${props.quizId}`);
        setQuestions(response.data);

        const res = await request.get(`/answerRecord/quiz/${props.quizId}/student/${user.id}`)
        console.log(res)
        for(const answer of res.data.data){
            const tmp : { [key: string] : string} = {}
            tmp[answer.questionId] = answer.studentAns
            setAnswerRecord((prev) => ({
                ...prev,
                ...tmp
            }))
        }
    } catch (e) {
      console.log('Error fetching last attempt data:', e);
    }
  };

  useEffect(() => {
    fetchAnswerRecordAndQuizQuestion()
  },[])
  
  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-center">{props.quizName}</h3>
                  <ul className="mt-2">
                    {questions.length > 0 && (
                      questions.map((question: QuestionDto, index: number) => (
                        <li key={index} className="mb-4">
                          <p><strong>Câu hỏi {index + 1}:</strong> {question.content}</p>
                          <p className={`${ answerRecord[question.id] !== question.answer? 'text-red-500' : 'text-green-500'}`}><strong>Câu trả lời của bạn:</strong> {answerRecord[question.id]}</p>
                        </li>
                      ))
                    )}
                  </ul>
              </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={props.onClose} 
                className="px-4 py-2 rounded border-2 border-black hover:scale-110 active:scale-90"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>

  );
}

export default LastAttempt;
