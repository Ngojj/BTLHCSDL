'use client';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import * as request from '@/app/axios/axios';
import Header from "../../../teacher_components/header";
import Sidebar from "../../../teacher_components/sidebar";
import { useRouter } from "next/navigation";

const QuizSection = ({ params }: { params: Promise<{ sectionId: string }> }) => {
  const [rtnParams, setRtnParams] = useState<{ sectionId: string }>({ sectionId: "" });
  const [section, setSection] = useState<any>({});
  const [quiz, setQuiz] = useState<any[]>([]);
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadParams = async () => {
      const unwrappedParams = await params;
      return { sectionId: unwrappedParams.sectionId };
    };

    loadParams().then((res) => setRtnParams(res));
    const userFromSessionRaw = sessionStorage.getItem('userLogin');
    if (userFromSessionRaw) {
      setUserLogin(JSON.parse(userFromSessionRaw));
    }
  }, []);

  useEffect(() => {
    if (!rtnParams.sectionId) return;

    const fetchSection = async () => {
      try {
        const response = await request.get(`/section/id/${rtnParams.sectionId}`);
        if (response.status === 200) {
          setSection(response.data[0]);
        }
      } catch (error) {
        console.log("Failed to fetch section");
      }
    };

    const fetchQuiz = async () => {
      try {
        const response = await request.get(`quiz/section/${rtnParams.sectionId}`);
        setQuiz(response);
      } catch (error) {
        console.log("Failed to fetch quiz");
        setQuiz([]);
      }
    };

    fetchSection();
    fetchQuiz();
  }, [rtnParams]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newQuiz = {
      id: quiz.length + 1,
      name: formData.get("quizName") as string,
      state: formData.get("quizState") as string,
      attempt: parseInt(formData.get("quizAttempt") as string, 10),
      duration: formData.get("quizDuration") as string,
      teacherId: userLogin.id,
      sectionId: section.id,
    };
    
    if (!userLogin.id || !section.id) return;

    const response = await request.post('/quiz/create', newQuiz);

    if (response) {
      setQuiz((prev) => [...prev, newQuiz]);
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (quizId: number) => {
    const quizToEdit = quiz.find((q) => q.id === quizId);
    if (quizToEdit) {
      setSelectedQuiz(quizToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDetailClick = (quizId: number) => {
    router.push(`/teacher/edit_quiz/${quizId}`);
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    const formData = new FormData(e.currentTarget  as HTMLFormElement);
    const updatedQuiz = {
      id: selectedQuiz.id,
      name: formData.get("quizName") as string,
      state: formData.get("quizState") as string,
      attempt: parseInt(formData.get("quizAttempt") as string, 10),
      duration: formData.get("quizDuration") as string,
      teacherId: userLogin.id,
      sectionId: section.id,
    };

    if (!userLogin.id || !section.id) return;

    const response = await request.patch('/quiz/update', updatedQuiz);

    if (response) {
      setQuiz((prev) =>
        prev.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q))
      );
    }

    setIsEditModalOpen(false);
  };

  if (!section.id) {
    return (
      <div className="section-shell py-8">
        <div className="grid min-h-screen grid-cols-12 gap-6">
          <div className="col-span-12">{Header(userLogin.lastName + ' ' + userLogin.firstName)}</div>
          {Sidebar(userLogin.firstName, userLogin.lastName)}
        </div>
      </div>
    )
  }

  return (
    <main className="section-shell py-8">
      <div className="grid min-h-screen grid-cols-12 gap-6">
        <div className="col-span-12">
          {Header(userLogin.lastName + ' ' + userLogin.firstName)}
        </div>
        {Sidebar(userLogin.firstName, userLogin.lastName)}

        <section className="col-span-10 rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-8 py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                  Quiz Manager
                </span>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                  Quiz: {section.name}
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Quản lý toàn bộ quiz thuộc học phần này, chỉnh sửa cấu hình và truy cập nhanh vào màn soạn câu hỏi.
                </p>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="button-primary">
                Thêm quiz
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-5 font-semibold">Tên quiz</th>
                    <th className="px-6 py-5 font-semibold">Trạng thái</th>
                    <th className="px-6 py-5 font-semibold text-center">Số lượt làm</th>
                    <th className="px-6 py-5 font-semibold text-center">Thời lượng</th>
                    <th className="px-6 py-5 text-center font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {quiz.length > 0 ? (
                    quiz.map((q, index) => (
                      <tr key={q.id ?? index} className="border-t border-slate-200 transition hover:bg-slate-50/70">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">{q.name}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {q.state || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">{q.attempt || "N/A"}</td>
                        <td className="px-6 py-5 text-center">{q.duration || "0"} phút</td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <Button onClick={() => handleDetailClick(q.id)} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100">
                              Chi tiết
                            </Button>
                            <Button onClick={() => handleEditClick(q.id)} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                              Chỉnh sửa
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-slate-500">Chưa có quiz nào cho học phần này.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {isEditModalOpen && selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
              <h2 className="text-2xl font-semibold text-slate-900">Chỉnh sửa quiz</h2>
              <form onSubmit={handleEditFormSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tên quiz</label>
                  <input type="text" name="quizName" defaultValue={selectedQuiz.name} className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Trạng thái</label>
                  <input type="text" name="quizState" defaultValue={selectedQuiz.state} className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Số lượt làm</label>
                  <input type="number" name="quizAttempt" defaultValue={selectedQuiz.attempt} className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Thời lượng (phút)</label>
                  <input type="text" name="quizDuration" defaultValue={selectedQuiz.duration} className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="button-primary flex-1">Lưu thay đổi</Button>
                  <Button type="button" onClick={() => setIsEditModalOpen(false)} className="button-secondary flex-1">Hủy</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
              <h2 className="text-2xl font-semibold text-slate-900">Thêm quiz mới</h2>
              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tên quiz</label>
                  <input type="text" name="quizName" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Trạng thái</label>
                  <input type="text" name="quizState" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Số lượt làm</label>
                  <input type="number" name="quizAttempt" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Thời lượng (phút)</label>
                  <input type="text" name="quizDuration" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="button-primary flex-1">Thêm quiz</Button>
                  <Button type="button" onClick={() => setIsModalOpen(false)} className="button-secondary flex-1">Hủy</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default QuizSection;
