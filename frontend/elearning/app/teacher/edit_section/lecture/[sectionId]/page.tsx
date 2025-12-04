'use client';
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import * as request from '@/app/axios/axios';
import Header from "../../../teacher_components/header";
import Sidebar from "../../../teacher_components/sidebar";
import CreateLecture from "./createLecture";
import {uploadFile} from "@/lib/upload-image";
const LectureSection = ({ params }: { params: Promise<{ sectionId: string }> }) => {
  const [rtnParams, setRtnParams] = useState<{ sectionId: string }>({ sectionId: "" });
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [section, setSection] = useState<any | null>(null);

  const fetchSection = async () => {
    if (!rtnParams.sectionId) return;
    try {
      const response = await request.get(`/section/id/${rtnParams.sectionId}`);
      console.log(response.data[0])
      setSection(response.data[0]);
    } catch (error) {
      console.error('Error fetching section:', error);
    }
  }
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
  const [lectures, setLectures] = useState<any[]>([]); // Khởi tạo là mảng rỗng

  useEffect(() => {
    if (!rtnParams.sectionId) return;

    const fetchLectures = async () => {
      try {
        let response = await request.get(`lecture/section/${rtnParams.sectionId}`);
        console.log(response)
        // Kiểm tra nếu response là mảng
        if (Array.isArray(response.data)) {
          setLectures(response.data);
        } else {
          console.log("Dữ liệu không phải là mảng:", response);
          setLectures([]); // Đặt lại thành mảng rỗng nếu dữ liệu không đúng
        }
      } catch (error) {
        console.log("Failed to fetch lectures");
        setLectures([]); // Đặt lại thành mảng rỗng nếu lỗi
      }
    };

    fetchLectures();
    fetchSection();
  }, [rtnParams]);


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const file = formData.get("lectureMaterial") as File | null;
  
    let materialUrl = null;
    if (file) {
      try {
        // Assume uploadFile is a function that uploads the file and returns the URL
        materialUrl = await uploadFile(file);
      } catch (error) {
        console.error('File upload failed:', error);
        return;
      }
    }
    else {
      console.error('No file selected');
      return;
    }
    
    const newLecture = {
      sectionId: Number(rtnParams.sectionId),
      name: formData.get("lectureName") as string,
      state: formData.get("lectureState") as string,
      reference: formData.get("lectureReference") as string,
      material: await materialUrl, // Send only the URL to the server
    };
    
    console.log(newLecture)
    try {
      const result = await CreateLecture(newLecture);
      console.log(result);
      if (result) {
        setLectures((prev) => [...prev, newLecture]);
        setIsModalOpen(false);
        // window.location.reload();
      } else {
        alert("Failed to add new lecture");
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  
  
  const handleDeleteClick = async (lectureId: number) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }
  
    try {
      const response = await request.del(`lecture/delete/${lectureId}`);
      if (response.status === 200) {
        setLectures((prev) => prev.filter((lecture) => lecture.id !== lectureId));
        console.log("Lecture deleted successfully");
      } else {
        console.error("Failed to delete lecture:", response);
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };
  
  
  

  const handleEditClick = (lectureId: number) => {
    const lectureToEdit = lectures.find((l) => l.id === lectureId);
    if (lectureToEdit) {
      setSelectedLecture(lectureToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLecture) return;
  
    setLoading(true); // Start loading
  
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedLecture = {
      id: selectedLecture.id,
      name: formData.get("lectureName") as string,
      state: formData.get("lectureState") as string,
      reference: formData.get("lectureReference") as string,
    };
  
    try {
      let response = await request.patch(`lecture/update`, updatedLecture);
      if (response.status === 200) {
        setLectures((prev) =>
          prev.map((l) => (l.id === updatedLecture.id ? { ...l, ...updatedLecture } : l))
        );
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to update lecture:", response);
      }
    } catch (error) {
      console.error("Error updating lecture:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  if (section === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid grid-rows-12 grid-cols-12 gap-4 bg-white">
      {Header(userLogin.lastName + ' ' + userLogin.firstName)}
      {Sidebar(userLogin.firstName, userLogin.lastName)}
      <div className="bg-white col-start-3 col-span-10 row-span-10 mb-4 rounded-xl overflow-hidden shadow-xl">
        <h1 className="bg-pink-600 rounded-t-xl text-center p-2 text-2xl text-white font-semibold uppercase">
          Lectures: {section.name}
        </h1>
          <div className="row-start-1 self-center flex justify-center mb-4">
            <Button onClick={() => setIsModalOpen(true)} className="bg-pink-600 mt-4">
              Add Lecture
            </Button>
          </div>
          <table className="table-auto w-full border-collapse border border-gray-200 text-sm text-left">
            <thead>
              <tr className="bg-pink-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">State</th>
                <th className="border border-gray-300 px-4 py-2">Material</th>
                <th className="border border-gray-300 px-4 py-2">Reference</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
              <tbody>
              {Array.isArray(lectures) && lectures.length > 0 ? (
                lectures.map((l, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 px-4 py-2">{l.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{l.state || "opened"}</td>
                    <td className="border border-gray-300 px-4 py-2">{l.material ? l.material : "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{l.reference || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                      <Button onClick={() => handleEditClick(l.id)} className="bg-yellow-500 text-white">
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteClick(l.id)} className="bg-red-600 text-white">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">No lectures available</td>
                </tr>
              )}
            </tbody>
          </table>
        

        {/* Modal for editing lecture */}
        {isEditModalOpen && selectedLecture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Edit Lecture</h2>
              <form onSubmit={handleEditFormSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    name="lectureName"
                    className="w-full border px-2 py-1 rounded"
                    defaultValue={selectedLecture.name}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">State</label>
                  <input
                    type="text"
                    name="lectureState"
                    className="w-full border px-2 py-1 rounded"
                    defaultValue={selectedLecture.state}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Reference</label>
                  <input
                    type="text"
                    name="lectureReference"
                    className="w-full border px-2 py-1 rounded"
                    defaultValue={selectedLecture.reference}
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="submit" className="bg-pink-600" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
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

      </div>

      {/* Modal for adding new lecture */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Lecture</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="lectureName"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">State</label>
                <input
                  type="text"
                  name="lectureState"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Material</label>
                <input
                  type="file"
                  name="lectureMaterial"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Reference</label>
                <input
                  type="text"
                  name="lectureReference"
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
  );
};

export default LectureSection;
