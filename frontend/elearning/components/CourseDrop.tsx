import request from "@/app/axios/axios";
import { LectureDto } from "@/app/dtos/lecture.dto";
import { QuizDto } from "@/app/dtos/quiz.dto";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LastAttempt from "./answerRecoil";

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
      setLectures([]);
    }
  };

  const fetchQuizes = async () => {
    try {
      const response = await request.get(`/quiz/section/${props.sectionId}`);
      setQuizes(response.data);

      const tmpAttempt : {[key: string] : number} = {}
      const tmpScore: {[key: string] : number} = {}

      for(const quiz of response.data){
        const dOResponse = await request.get(`/dO/quiz/${quiz?.id}/student/${props.userId}`)
        tmpAttempt[String(quiz.id)] = dOResponse.data.data.length

        if(dOResponse.data.data.length !== 0){
          tmpScore[String(quiz.id)] = 0
          for(const dO of dOResponse.data.data){
            tmpScore[String(quiz.id)] += dO.score
          }
          tmpScore[String(quiz.id)] /= dOResponse.data.data.length
        }
      }

      setAttempts(tmpAttempt);
      setScore(tmpScore);
    } catch (e) {
      console.log(e);
      setQuizes([]);
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
    <div className="my-5 w-full">
      {isWatchLastAttemp && (
        <LastAttempt onClose={() => setIsWatchLastAttemp(false)} quizId={selectQuizId} quizName={selectQuizName}/>
      )}

      <div
        className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-sky-200 hover:bg-white"
        onClick={toggleDropdown}
      >
        <span className="text-base font-semibold text-slate-900">{props.title}</span>
        <span className="text-slate-500">{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div className="mt-3 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          {props.title !== "Giới thiệu" ? (
            <>
              {lectures && lectures.length > 0 ? (
                <>
                  {lectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="mb-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="text-lg font-semibold text-slate-900">{lecture.name}</p>
                      <div className="mt-4">
                        <p className="mb-3 text-sm font-medium text-slate-700">Video bài giảng</p>
                        <video controls className="mx-auto block w-full rounded-2xl border border-slate-200 shadow-sm">
                          <source src={lecture.material} type="video/mkv" />
                          <source src={lecture.material.replace('.mkv', '.mp4')} type="video/mp4" />
                          Trình duyệt của bạn không hỗ trợ video.
                        </video>
                      </div>
                      <p className="mt-4 text-sm font-medium text-slate-700">
                        Tài liệu học tập:{" "}
                        <a
                          href={lecture.reference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-sky-700 underline"
                        >
                          Tải tài liệu
                        </a>
                      </p>
                    </div>
                  ))}

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Quiz cuối chương
                    </h3>
                    {quizes && quizes.length > 0 ? (
                      <ul className="mt-4 space-y-4">
                        {quizes.map((quiz) => {
                          const currentAttempts = attempts[quiz.id] || 0;
                          const maxAttempts = quiz.attempt;
                          const remainingAttempts = Math.max(0, maxAttempts - currentAttempts);
                          const quizScore = score[String(quiz.id)] || 0; 

                          return (
                            <li
                              key={quiz.id}
                              className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
                            >
                              <div>
                                <span className="text-lg font-semibold text-slate-900">{quiz.name}</span>
                                <div className="mt-2 space-y-1 text-sm">
                                  {currentAttempts > 0 ? (
                                    <p className="text-emerald-600">Điểm trung bình các lần làm: {quizScore.toFixed(2)}</p>
                                  ) : (
                                    <p className="text-slate-500">Chưa có điểm</p>
                                  )}

                                  <p className="text-slate-500">
                                    {remainingAttempts > 0
                                      ? `Còn lại ${remainingAttempts} lượt làm bài`
                                      : "Đã hết lượt làm bài"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {currentAttempts > 0 && (
                                  <button
                                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                    onClick={() => {
                                      setSelectQuizId(quiz.id)
                                      setSelectQuizName(quiz.name)
                                      setIsWatchLastAttemp(true)
                                    }}
                                  >
                                    Xem lần gần nhất
                                  </button>
                                )}

                                {currentAttempts >= maxAttempts ? (
                                  <span className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700">
                                    Hết lượt làm bài
                                  </span>
                                ) : (
                                  <button
                                    className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                    onClick={() =>
                                      router.push(`/quizzes?quiz=${encodeURIComponent(JSON.stringify(quiz))}`)
                                    }
                                  >
                                    {currentAttempts === 0 ? "Làm bài ngay" : "Làm lại"}
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-4 text-center text-slate-500">
                        Không có quiz nào cho chương này.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center text-slate-500">Không có bài giảng nào trong chương này.</p>
              )}
            </>
          ) : (
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm leading-7 text-slate-600">{props.description}</p>
              <p className="mt-3 text-sm italic text-slate-500">Vui lòng hoàn thành quiz sau mỗi chương để theo dõi tiến độ tốt hơn.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDropdown;
