'use client';
import { ChangeEvent, useEffect, useState } from "react";
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
  const router = useRouter(); // Initialize useRouter
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
        let response = await request.get(`/section/id/${rtnParams.sectionId}`);
        if (response.status === 200) {
          setSection(response.data[0]);
        }
      } catch (error) {
        console.log("Failed to fetch section");
      }
    };

    const fetchQuiz = async () => {
      try {
        let response = await request.get(`quiz/section/${rtnParams.sectionId}`);
        setQuiz(response);
      } catch (error) {
        console.log("Failed to fetch quiz");
      }
    };

    fetchSection();
    fetchQuiz();
  }, [rtnParams]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newQuiz = {
      id: quiz.length + 1, // Dummy ID for demonstration
      name: formData.get("quizName") as string,
      state: formData.get("quizState") as string,
      attempt: parseInt(formData.get("quizAttempt") as string, 10),
      duration: formData.get("quizDuration") as string,
      teacherId: userLogin.id,
      sectionId: section.id,
    };
    
    if (!userLogin.id || !section.id) return;
    console.log("New Quiz Added:", newQuiz);

    const response = await request.post('/quiz/create', newQuiz);

    if (response) {
      setQuiz((prev) => [...prev, newQuiz]);
      setIsModalOpen(false);
    }
    else{
      console.log("Failed to add quiz");
      setIsEditModalOpen(false);
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
    router.push(`/teacher/edit_quiz/${quizId}`); // Navigate to edit_quiz/[quizId]
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
    console.log("Updated Quiz:", updatedQuiz);

    const response = await request.patch('/quiz/update', updatedQuiz);

    if (!response){
      console.log("Failed to update quiz");
      setIsEditModalOpen(false);
    }
    // Update quiz in the state
    setQuiz((prev) =>
      prev.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q))
    );

    setIsEditModalOpen(false);
  };

  if (!section.id) {
    
    return (<>
      <div className="grid grid-rows-12 grid-cols-12 gap-4 bg-black">
        {Header(userLogin.lastName + ' ' + userLogin.firstName)}
        {Sidebar(userLogin.firstName, userLogin.lastName)}
      </div>
    </>)
  }
  return (
    <div className="grid grid-cols-12 gap-4 bg-white grid-rows-[auto,1fr]">

    
    {Header(userLogin.lastName + ' ' + userLogin.firstName)}
    {Sidebar(userLogin.firstName, userLogin.lastName)}
    <div className="bg-white col-start-3 col-span-10 row-span-10 rounded-xl shadow-xl mb-4 min-h-screen">
      <h1 className="bg-pink-600 rounded-t-xl text-center p-2 text-2xl text-white font-semibold uppercase">
        Quiz: {section.name}
      </h1>
        <div className="row-start-1 self-center flex justify-center my-4">
          <Button onClick={() => setIsModalOpen(true)} className="bg-pink-600">
            Add Quiz
          </Button>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-200 text-sm text-left">
          <thead>
            <tr className="bg-pink-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">State</th>
              <th className="border border-gray-300 px-4 py-2">Attempt</th>
              <th className="border border-gray-300 px-4 py-2">Duration</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {quiz.map((q, index) => (
              <tr
                key={q.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2">{q.name}</td>
                <td className="border border-gray-300 px-4 py-2">{q.state || "Pending"}</td>
                <td className="border border-gray-300 px-4 py-2">{q.attempt || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{q.duration || "0 mins"}</td>
                <td className="border border-gray-300 px-4 py-2">
                <Button
                      onClick={() => handleDetailClick(q.id)}
                      className="bg-blue-500 text-white"
                    >
                      Detail
                    </Button>
                  <Button
                    onClick={() => handleEditClick(q.id)}
                    className="bg-yellow-500 text-white"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      

      {/* Modal for editing quiz */}
      {isEditModalOpen && selectedQuiz && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Quiz</h2>
            <form onSubmit={handleEditFormSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="quizName"
                  defaultValue={selectedQuiz.name}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">State</label>
                <input
                  type="text"
                  name="quizState"
                  defaultValue={selectedQuiz.state}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Attempts</label>
                <input
                  type="number"
                  name="quizAttempt"
                  defaultValue={selectedQuiz.attempt}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Duration</label>
                <input
                  type="text"
                  name="quizDuration"
                  defaultValue={selectedQuiz.duration}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="flex justify-between">
                <Button type="submit" className="bg-pink-600">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for adding quiz */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Quiz</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="quizName"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">State</label>
                <input
                  type="text"
                  name="quizState"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Attempts</label>
                <input
                  type="number"
                  name="quizAttempt"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Duration</label>
                <input
                  type="text"
                  name="quizDuration"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="flex justify-between">
                <Button type="submit" className="bg-pink-600">
                  Add Quiz
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default QuizSection;
