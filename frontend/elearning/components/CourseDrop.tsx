import request from "@/app/axios/axios";
import { LectureDto } from "@/app/dtos/lecture.dto";
import { QuizDto } from "@/app/dtos/quiz.dto";
import { userLoginState } from "@/state";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import LastAttempt from "./answerRecoil";
import Footer from "./Footer";

function CourseDropdown(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWatchLastAttemp, setIsWatchLastAttemp] = useState(false);
  const [selectQuizId, setSelectQuizId] = useState<number>(0);
  const [selectQuizName, setSelectQuizName] = useState<string>("");
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [quizes, setQuizes] = useState<QuizDto[]>([]);
  const [attempts, setAttempts] = useState<{ [key: string]: number }>({});
  const [score, setScore] = useState<{[key: string]: number}>({})
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const fetchLectures = async () => {
    try {
      const response = await request.get(`/lecture/section/${props.sectionId}`);
      setLectures(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchQuizes = async () => {
    try {
      // print out the url
      console.log('/quiz/section/' + props.sectionId)
      const response = await request.get(`/quiz/section/${props.sectionId}`);
      setQuizes(response.data);

      const tmpAttemp : {[key: string] : number} = {}
      for(const quiz of response.data){
        // print out the url
        console.log(`/dO/quiz/${quiz?.id}/student/${props.userId}`)
        const dOResponse = await request.get(`/dO/quiz/${quiz?.id}/student/${props.userId}`)
        tmpAttemp[String(quiz.id)] = dOResponse.data.data.length

        if(dOResponse.data.data.length !== 0){
          const tmpScore : {[key: string] : number} = {}
          tmpScore[String(quiz.id)] = 0
          for(const dO of dOResponse.data.data){
            tmpScore[String(quiz.id)] += dO.score
          }
          tmpScore[String(quiz.id)] /= dOResponse.data.data.length

          setScore((prev) => ({
            ...prev,
            ...tmpScore, 
          }));
        }
        setAttempts((prev) => ({
          ...prev,
          ...tmpAttemp
        }));
      }

      console.log(score)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (props.userId === "") return;
    if (props.sectionId !== "") {
      fetchLectures();
      fetchQuizes();
    }
  }, [props.sectionId, props.userId]);

  return (
    <div className="w-full my-5">
      {isWatchLastAttemp && (
        <LastAttempt onClose={() => setIsWatchLastAttemp(false)} quizId={selectQuizId} quizName={selectQuizName}/>
      )}
      <div
        className="flex items-center justify-between bg-gray-100 p-4 border border-black rounded-3xl cursor-pointer mx-8"
        onClick={toggleDropdown}
      >
        <span className="text-lg font-medium">{props.title}</span>
        <span className="transform transition-transform duration-200">
          {isOpen ? "▼" : "▶"}
        </span>
      </div>

      {isOpen && (
        <div className="bg-gray-50 border border-gray-300 rounded-3xl mx-8 p-4">
          {props.title !== "Chung"? (
            <>
            {lectures && lectures.length > 0 ? (
            <>
              {lectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="mb-6 space-y-4 bg-white shadow-md p-4 rounded-xl"
                >
                  <p className="font-semibold text-lg text-gray-800">{lecture.name}</p>
                  <div>
                    <p className="text-gray-700 font-medium">- Video bài giảng:</p>
                    <video controls className="rounded-lg shadow-xl mx-auto block w-[50%]">
                      <source src={lecture.material} type="video/mkv" />
                      <source src={lecture.material.replace('.mkv', '.mp4')} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>

                  </div>
                  <p className="text-gray-700 font-medium">
                    - Tài liệu học tập:{" "}
                    <a
                      href={lecture.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Tải tài liệu
                    </a>
                  </p>
                </div>
              ))}

              {/* Quizzes */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Kiểm tra cuối chương
                </h3>
                {quizes && quizes.length > 0 ? (
                  <ul className="space-y-4">
                  {quizes.map((quiz) => {
                    const currentAttempts = attempts[quiz.id] || 0;
                    const maxAttempts = quiz.attempt;
                    const remainingAttempts = Math.max(0, maxAttempts - currentAttempts);
                    const quizScore = score[String(quiz.id)] || 0; 

                    return (
                      <li
                      key={quiz.id}
                      className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-xl"><b>{quiz.name}</b></span>
                    
                        {currentAttempts > 0 ? (
                          <span className="text-green-500">Điểm trung bình các lần làm bài: {quizScore}</span>
                        ) : (
                          <span className="text-gray-600">Chưa có điểm</span>
                        )}
                    
                        <span className="text-gray-600 italic">
                          {remainingAttempts > 0
                            ? `Còn lại: ${remainingAttempts} lượt làm bài`
                            : "Hết lượt làm bài"}
                        </span>
                      </div>
                    
                      <div className="flex space-x-4">
                        {/* "Xem lại đáp án lần làm gần nhất" button first */}
                        {currentAttempts > 0 && (
                          <button
                          className="text-orange-500 px-6 py-2 hover:scale-110 active:scale-90"
                          onClick={() => {
                            setSelectQuizId(quiz.id )
                            setSelectQuizName(quiz.name)
                            setIsWatchLastAttemp(true)
                          }}
                        >
                          Xem lại đáp án lần làm gần nhất
                        </button>
                        )}
                    
                        {/* Conditional buttons for quiz attempts */}
                        {currentAttempts >= maxAttempts ? (
                          <span className="text-red-500 italic">Bạn đã hết lượt làm bài</span>
                        ) : (
                          <>
                            <button
                              className="text-blue-500 px-6 py-2 hover:scale-110 active:scale-90"
                              onClick={() =>
                                router.push(
                                  `/quizzes?quiz=${encodeURIComponent(
                                    JSON.stringify(quiz)
                                  )}`
                                )
                              }
                            >
                              {currentAttempts === 0 ? "Thực hiện ngay" : "Thực hiện lại"}
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                    
                    );
                  })}

                  </ul>
                ) : (
                  <p className="text-center text-gray-700">
                    Không có quiz nào cho chương này.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-center">Không có bài giảng nào trong chương này.</p>
          )}
            </>
          ) : (
            <>
              <p className="text-center">{props.description}</p>
              <p className="text-center"><i>Vui lòng thực hiện quiz sau mỗi chương</i></p>
            </>
            
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDropdown;
