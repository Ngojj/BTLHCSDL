'use client';
import { ChangeEvent, useEffect, useState } from "react";
import Header from "../../teacher_components/header"
import Sidebar from "../../teacher_components/sidebar"
import { userLoginState } from "@/state";
import { useRecoilState } from "recoil";
import * as request from '@/app/axios/axios'
interface Question {
    id: number; // Add this line
    content: string;
    type: "multiple choice" | "fill in blank";
    options: string[];
    correctAnswerIndex: number;
    answer: string;
}

const editQuizPage = ({ params }: { params: Promise<{ quizId: string }> }) => {
    const [rtnParams, setRtnParams] = useState<{ quizId: string }>({ quizId: "" });
    const loadParams = async () => {
        const unwrappedParams = await params;
        return { quizId: unwrappedParams.quizId };
    }
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)
    // const [questions, setQuestions] = useState<Question[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState<Question>({
        content: "",
        type: "multiple choice",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
        answer: "",
        id: 0
    });
    const [quiz, setQuiz] = useState<any>({})
    const fetchhQuiz = async () => {
        if ((!rtnParams.quizId)) return;
        try {
            const response = await request.get(`/quiz/id/${rtnParams.quizId}`)
            console.log("Quiz Response:", response);
            setQuiz(response[0])
        } catch (error) {
            console.error('Error fetching quiz:', error);
        }
    }
    const handleEditQuestion = async (questionId: number, newContent: string) => {
        const questionToEdit = sampleQuestions.find((question) => question.id === questionId);
        if (!questionToEdit) {
            alert("Question not found!");
            return;
        }
    
        try {
            // Send updated content to the API
            await request.patch("http://localhost:4000/question/update", {
                id: questionToEdit.id,
                quizId: rtnParams.quizId,
                content: newContent,
                teacherId: userLogin.id, // Assuming `userLogin.id` contains the teacher's ID
            });
    
            // Update the content locally
            setSampleQuestions(
                sampleQuestions.map((question) =>
                    question.id === questionId ? { ...question, content: newContent } : question
                )
            );
    
            alert("Question updated successfully!");
        } catch (error) {
            console.error("Error updating question:", error);
            alert("Failed to update the question. Please try again.");
        }
    };
    
    const handleDeleteQuestion = async (questionId: number) => {
        try {
            // Call the API to delete the question
            await request.del(`http://localhost:4000/question/delete/id/${questionId}`);
            console.log(`Question with ID ${questionId} deleted successfully.`);
    
            // Remove the deleted question from the state
            setSampleQuestions(sampleQuestions.filter((question) => question.id !== questionId));
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Failed to delete the question. Please try again.");
        }
    };

    const handleAddQuestion = async () => {
        const requestBody = {
            quizId: rtnParams.quizId, // Assuming this is set properly
            type: newQuestion.type,
            answer: newQuestion.type === "fill in blank" ? newQuestion.options[0] : newQuestion.options[newQuestion.correctAnswerIndex],
            content: newQuestion.content,
            teacherId: userLogin.id, // Assuming `userLogin` holds the teacher's ID
            options: newQuestion.type === "multiple choice" ? newQuestion.options : undefined,
        };
    
        try {
            // API call to create the question
            const response = await request.post('http://localhost:4000/question/create', requestBody);
            console.log("Question created:", response);
            if (!response){
                return
            }
            // Add the newly created question to the list
            setSampleQuestions([...sampleQuestions, newQuestion]);
    
            // Reset the new question form
            setNewQuestion({
                content: "",
                type: "multiple choice",
                options: ["", "", "", ""],
                correctAnswerIndex: 0,
                answer: "",
                id: 0
            });
    
            // Close the modal
            setModalOpen(false);
        } catch (error) {
            console.error("Error creating question:", error);
            alert("Failed to add the question. Please try again.");
        }
    };
    

    const renderAnswers = (question: { content: string; type: string; options: string[]; correctAnswerIndex: number, answer: string }) => {
        if (question.type === "multiple choice") {
            if (!question.options) return
            return question.options.map((answer, index) => (
                <div
                    key={index}
                    className={`p-2 rounded-lg ${
                        answer === question.answer
                            ? "bg-green-200"
                            : "bg-red-200"
                    }`}
                >
                    {answer}
                </div>
            ));
        } else if (question.type === "fill in blank") {
            return (
                <div className="p-2 rounded-lg bg-green-200">
                    Correct Answer: {question.answer}
                </div>
            );
        }
    };
    const [sampleQuestions, setSampleQuestions] = useState<Question[]>([])

    const fetchQuestions = async () => {
    if (!rtnParams.quizId) return;
    try {
        // Fetch all questions for the quiz
        const response = await request.get(`/question/quiz/${rtnParams.quizId}`);
        console.log("Questions Response:", response);

        if (response) {
            // Fetch options for all multiple-choice questions
            const questionsWithOptions = await Promise.all(
                response.map(async (question: any) => {
                    if (question.type === "multiple choice") {
                        const optionsResponse = await request.get(`/option/id/${question.id}`);
                        question.options = optionsResponse.data.data.map((option: any) => option.option);
                    } else {
                        question.options = []; // Ensure options field exists
                    }
                    return question;
                })
            );

            // Update state with questions and their options
            setSampleQuestions(questionsWithOptions);
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
};

    
    useEffect(() => {
        loadParams().then((res) => setRtnParams(res));
        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
    }, [])
    
    useEffect(() => {
        fetchhQuiz();
        fetchQuestions();
    }, [rtnParams.quizId]);
    
    if (!quiz) {
        return <div>Quiz not found</div>;
    }
    
    return (
        <div className="grid grid-rows-12 grid-cols-12 gap-4 bg-grayBG">
            {Header(userLogin.lastName + ' ' + userLogin.firstName)}
            {Sidebar(userLogin.firstName, userLogin.lastName)}
            <div className="bg-pink-600 col-start-3 col-span-10 row-span-1 rounded-xl text-3xl text-white font-semibold uppercase items-center p-5 flex flex-col justify-center">
                <h1 className="self-center">quiz title: {quiz.name}</h1>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => setModalOpen(true)}
                >
                    Add Question
                </button>
            </div>
            {/* Questions Container */}
            <div className="space-y-6 bg-white col-start-3 col-span-10 row-span-9 mb-4 rounded-xl">
                {sampleQuestions.map((question, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md p-6 rounded-lg space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            
                            <h2 className="text-lg font-semibold">{`Q${index + 1}: ${question.content}`}</h2>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                Delete
                            </button>

                            <input
                                type="text"
                                className="w-3/4 border rounded-lg p-2"
                                value={question.content}
                                onChange={(e) =>
                                    setSampleQuestions(
                                        sampleQuestions.map((q) =>
                                            q.id === question.id ? { ...q, content: e.target.value } : q
                                        )
                                    )
                                }
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={() => handleEditQuestion(question.id, question.content)}
                            >
                                Save
                            </button>
                        </div>
                        <div className="space-y-2">{renderAnswers(question)}</div>
                    </div>
                
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add a Question</h2>
                        <label className="block mb-2">
                            Question Text:
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2 mt-1"
                                value={newQuestion.content}
                                onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, content: e.target.value })
                                }
                            />
                        </label>
                        <label className="block mb-2">
                            Question Type:
                            <select
                                className="w-full border rounded-lg p-2 mt-1"
                                value={newQuestion.type}
                                onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, type: e.target.value as "multiple choice" | "fill in blank" })
                                }
                            >
                                <option value="multiple choice">Multiple Choice</option>
                                <option value="fill in blank">Fill in the Blank</option>
                            </select>
                        </label>

                        {newQuestion.type === "multiple choice" && (
                            <>
                                {newQuestion.options.map((answer, index) => (
                                    <label key={index} className="block mb-2">
                                        Answer {index + 1}:
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg p-2 mt-1"
                                            value={answer}
                                            onChange={(e) => {
                                                const updatedAnswers = [...newQuestion.options];
                                                updatedAnswers[index] = e.target.value;

                                                setNewQuestion({
                                                    ...newQuestion,
                                                    options: updatedAnswers,
                                                    answer: index === newQuestion.correctAnswerIndex ? e.target.value : newQuestion.answer, // Update `answer` if it matches the correct answer
                                                });

                                                // Reset correctAnswerIndex if the selected answer is deleted or modified
                                                if (newQuestion.correctAnswerIndex === index && !e.target.value) {
                                                    setNewQuestion({
                                                        ...newQuestion,
                                                        correctAnswerIndex: 0, // Reset to default
                                                        answer: updatedAnswers[0] || "", // Update answer to new default
                                                    });
                                                }
                                            }}
                                        />
                                    </label>
                                ))}


                                {/* Dropdown for selecting the correct answer */}
                                {/* Dropdown for selecting the correct answer */}
                                <label className="block mb-2">
                                    Correct Answer:
                                    <select
                                        className="w-full border rounded-lg p-2 mt-1"
                                        value={newQuestion.correctAnswerIndex}
                                        onChange={(e) => {
                                            const selectedAnswerIndex = parseInt(e.target.value, 10);
                                            setNewQuestion({
                                                ...newQuestion,
                                                correctAnswerIndex: selectedAnswerIndex,
                                                answer: newQuestion.options[selectedAnswerIndex] || "", // Assign the selected option's text to `answer`
                                            });
                                        }}
                                    >
                                        {newQuestion.options.map((option, index) => (
                                            <option key={index} value={index}>
                                                {option || `Answer ${index + 1}`} {/* Fallback for empty answers */}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                            </>
                        )}


                        {newQuestion.type === "fill in blank" && (
                            <label className="block mb-2">
                                Correct Answer:
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={newQuestion.options[0]}
                                    onChange={(e) => {
                                        const updatedAnswer = e.target.value;
                                        setNewQuestion({
                                            ...newQuestion,
                                            options: [updatedAnswer], // Update options[0]
                                            answer: updatedAnswer,   // Keep answer in sync with options[0]
                                        });
                                    }}
                                />
                            </label>
                        )}


                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded-lg"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                onClick={handleAddQuestion}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default editQuizPage

