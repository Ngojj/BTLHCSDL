'use client';
import { useEffect, useState } from "react";
import Header from "../../teacher_components/header"
import Sidebar from "../../teacher_components/sidebar"
import { Button } from '@/components/ui/button';
import { userLoginState } from "@/state";
import { useRecoilState } from "recoil";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import * as request from '@/app/axios/axios'
import { on } from "events";
interface Section {
    id: string;
    name: string;
    numOfLecture: number;
    quiz: number;
    creTime: string;
    timeToComplete: number;
}

const SectionTable = ({
    sections,
    onEdit,
    onDetailQuiz,
    onDetailLecture,
    onDelete,
}: {
    sections: Section[];
    onEdit: (index: number, id: string) => void;
    onDetailQuiz: (index: number, id: string) => void;
    onDetailLecture: (index: number, id: string) => void;
    onDelete: (id: string) => void; // Add the delete handler type
}) => {
    return (
        <div className="p-4">
            {/* Table */}
            <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-hcmutDarkBlue text-white">
                    <tr>
                        <th className="px-6 py-3 text-left uppercase text-sm font-medium">
                            Section ID
                        </th>
                        <th className="px-6 py-3 text-left uppercase text-sm font-medium">
                            Section Name
                        </th>
                        <th className="px-6 py-3 text-left uppercase text-sm font-medium">
                            Number of Lectures
                        </th>
                        <th className="px-6 py-3 text-left uppercase text-sm font-medium">
                            Created At
                        </th>
                        <th className="px-6 py-3 text-left uppercase text-sm font-medium">
                            Time to Complete
                        </th>
                        <th className="px-6 py-3 text-left uppercase text-sm font-medium">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((section, index) => (
                        <tr
                            key={section.id}
                            className={` ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
                        >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {index+1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{section.name.length > 0 ? section.name : "ĐANG TẢI"}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                {section.numOfLecture}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                {section.creTime}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                {section.timeToComplete} minutues
                            </td>
                            
                            <td className="flex gap-5 items-center my-auto mt-1">
                                {/* Action Buttons */}
                                <button
                                    onClick={() => onEdit(index + 1, section.id)}
                                    className="bg-hcmutLightBlue text-white px-6 py-2 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDetailQuiz(index + 1, section.id)}
                                    className="bg-hcmutLightBlue text-white px-6 py-2 rounded hover:bg-blue-600"
                                >
                                    Quiz
                                </button>
                                <button
                                    onClick={() => onDetailLecture(index + 1, section.id)}
                                    className="bg-hcmutLightBlue text-white px-6 py-2 rounded hover:bg-blue-600"
                                >
                                    Lecture
                                </button>
                                <button
                                    onClick={() => onDelete(section.id)} // Pass the section ID to the delete handler
                                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// loading UI
const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="flex items-center space-x-2">
            <svg
                className="animate-spin h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span className="text-white text-lg">Loading...</span>
        </div>
    </div>
);

const editCoursePage = ({ params }: { params: Promise<{ courseId: string }> }) => {
    const [loading, setLoading] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const [rtnParams, setRtnParams] = useState<{ courseId: string }>({ courseId: "" });
    const loadParams = async () => {
        const unwrappedParams = await params;
        return { courseId: unwrappedParams.courseId };
    }
    const [sections, setSections] = useState([]);
    const [course, setCourse] = useState<any>({});
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)
    
    useEffect(() => {
            const userFromSessionRaw = sessionStorage.getItem('userLogin')
            if(!userFromSessionRaw) return
            setUserLogin(JSON.parse(userFromSessionRaw))  
        }, [])
    const fetchSections = async () => {
        // Fetch sections from API
        if (!rtnParams.courseId) return;
        try {
            let response = await request.get(`/section/course/${rtnParams.courseId}`);
            setLoading(true)
            console.log(response)
            if (response.status === 200){
                setLoading(false)
                console.log(response.data)
                setSections(response.data);
            }
            else if (response.status === 404){
                console.log("No sections found");
                
            }
        } catch (error) {
            
            console.log("Failed to fetch sections: ", error);
        }
    }
    const fetchCourse = async () => {
        if (!rtnParams.courseId) return;
        try {
            let response = await request.get(`/course/id/${rtnParams.courseId}`);
            console.log(response)
            setLoading(true)
            if (response.message === "success"){
                setLoading(false)
                console.log(response.data)
                setCourse(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch course");
        }
    }
    useEffect(() => {
        loadParams().then((res) => setRtnParams(res));
    },[])
    useEffect(() => {
        fetchSections();
        fetchCourse();
    }, [rtnParams]);

    const handleEdit = (index: number, id: string) => {
        const section = sections.find((s : any) => s.id === id);
        if (section) {
            console.log("Editing section: ", section);
            setEditingSection(section);
            setIsEditing(true);
        }
    };
    
    const handleEditDetailQuiz = (index: number, id: string) => {
        router.push(`/teacher/edit_section/quiz/${id}`)
    }
    const handleEditDetailLecture = (index: number, id: string) => {
        router.push(`/teacher/edit_section/lecture/${id}`)
    }
    const handleDeleteSection = async (id: string) => {
        if (!id) {
            alert("Invalid section ID!");
            return;
        }
    
        if (confirm("Are you sure you want to delete this section?")) {
            setLoading(true); // Start loading indicator
            try {
                const response = await request.del(`/section/delete/${id}`);
                if (response.status === 200) {
                    alert("Section deleted successfully!");
                    fetchSections(); // Refresh the section list
                } else {
                    alert("Failed to delete section. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting section:", error);
                alert("An error occurred while deleting the section.");
            } finally {
                setLoading(false); // End loading indicator
            }
        }
    };
    
    const handleAddSection = async () => {
        if (confirm("Are you sure you want to add a new section?") === false) return;
        const newSection = {
            name: `New Section ${sections.length + 1}`,
            numOfLecture: 0,
            timeToComplete: 0,
            courseId: parseInt(rtnParams.courseId),
            teacherId: parseInt(userLogin.id)
        };

        try {
            let res = await request.post(`/section/create`, newSection);
            if (res.status === 200){
                console.log("Successfully added section");
                fetchSections();
            }
        } catch (error) {
            console.log("Failed to add section: ", error);
        }

        console.log(newSection);
    };

    if (loading) {
        return <LoadingOverlay></LoadingOverlay>
    }
    return (
        <div className="grid grid-rows-12 grid-cols-12 gap-4 bg-grayBG   ">
            {Header(userLogin.lastName + ' ' + userLogin.firstName)}
            {Sidebar(userLogin.firstName, userLogin.lastName)}
            {/* content */}
            {isEditing && editingSection && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Section</h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true); // Bắt đầu loading
                                try {
                                    const res = await request.patch(`/section/update`, editingSection);
                                    if (res.status === 200) {
                                        setIsEditing(false);
                                        fetchSections(); // Reload sections
                                    }
                                } catch (error) {
                                    console.error("Failed to update section: ", error);
                                } finally {
                                    setLoading(false); // Kết thúc loading
                                }
                            }}
                            
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={editingSection.name}
                                    onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Number of Lectures</label>
                                <input
                                    type="number"
                                    value={editingSection.numOfLecture}
                                    onChange={(e) =>
                                        setEditingSection({ ...editingSection, numOfLecture: parseInt(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Time to Complete (minutes)</label>
                                <input
                                    type="number"
                                    value={editingSection.timeToComplete}
                                    onChange={(e) =>
                                        setEditingSection({ ...editingSection, timeToComplete: parseInt(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-black">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-hcmutLightBlue text-white">
                                    Save
                                </Button>
                            </div>
                            {loading && <LoadingOverlay />}
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white col-start-3 col-span-10 row-span-10 mb-4 rounded-xl shadow-xl">
                {/* Header */}
                <div className="bg-hcmutLightBlue rounded-t-xl text-center text-3xl text-white font-semibold uppercase items-center p-5">
                    <h1>{course.courseName} </h1>
                    <Button className="bg-hcmutDarkBlue mt-3" onClick={handleAddSection}>Thêm học phần</Button>
                </div>
                
                <div className="">
                <SectionTable
                    sections={sections}
                    onEdit={handleEdit}
                    onDetailQuiz={handleEditDetailQuiz}
                    onDetailLecture={handleEditDetailLecture}
                    onDelete={handleDeleteSection} // Add the delete handler
                />

                </div>
            </div>
        </div>
    )
}
export default editCoursePage