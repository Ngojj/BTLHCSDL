'use client';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { useRecoilState } from "recoil";
import { userLoginState } from "@/state";
import * as request from '@/app/axios/axios';
import Header from "../../../teacher_components/header";
import Sidebar from "../../../teacher_components/sidebar";
import CreateLecture from "./createLecture";
import { uploadFile } from "@/lib/upload-image";

const LectureSection = ({ params }: { params: Promise<{ sectionId: string }> }) => {
  const [rtnParams, setRtnParams] = useState<{ sectionId: string }>({ sectionId: "" });
  const [userLogin, setUserLogin] = useRecoilState(userLoginState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<any | null>(null);
  const [lectures, setLectures] = useState<any[]>([]);

  const fetchSection = async () => {
    if (!rtnParams.sectionId) return;
    try {
      const response = await request.get(`/section/id/${rtnParams.sectionId}`);
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

  useEffect(() => {
    if (!rtnParams.sectionId) return;

    const fetchLectures = async () => {
      try {
        const response = await request.get(`lecture/section/${rtnParams.sectionId}`);
        if (Array.isArray(response.data)) {
          setLectures(response.data);
        } else {
          setLectures([]);
        }
      } catch (error) {
        console.log("Failed to fetch lectures");
        setLectures([]);
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
        materialUrl = await uploadFile(file);
      } catch (error) {
        console.error('File upload failed:', error);
        return;
      }
    } else {
      console.error('No file selected');
      return;
    }
    
    const newLecture = {
      sectionId: Number(rtnParams.sectionId),
      name: formData.get("lectureName") as string,
      state: formData.get("lectureState") as string,
      reference: formData.get("lectureReference") as string,
      material: await materialUrl,
    };
    
    try {
      const result = await CreateLecture(newLecture);
      if (result) {
        setLectures((prev) => [...prev, newLecture]);
        setIsModalOpen(false);
      } else {
        alert("Không thể thêm bài giảng mới.");
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  const handleDeleteClick = async (lectureId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài giảng này?")) {
      return;
    }
  
    try {
      const response = await request.del(`lecture/delete/${lectureId}`);
      if (response.status === 200) {
        setLectures((prev) => prev.filter((lecture) => lecture.id !== lectureId));
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
  
    setLoading(true);
  
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedLecture = {
      id: selectedLecture.id,
      name: formData.get("lectureName") as string,
      state: formData.get("lectureState") as string,
      reference: formData.get("lectureReference") as string,
    };
  
    try {
      const response = await request.patch(`lecture/update`, updatedLecture);
      if (response.status === 200) {
        setLectures((prev) =>
          prev.map((l) => (l.id === updatedLecture.id ? { ...l, ...updatedLecture } : l))
        );
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating lecture:", error);
    } finally {
      setLoading(false);
    }
  };

  if (section === null) {
    return <div>Loading...</div>;
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
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Lecture Manager
                </span>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                  Bài giảng: {section.name}
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Quản lý video bài giảng, tài liệu và trạng thái nội dung của từng học phần trong một workspace rõ ràng hơn.
                </p>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="button-primary">
                Thêm bài giảng
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-5 font-semibold">Bài giảng</th>
                    <th className="px-6 py-5 font-semibold">Trạng thái</th>
                    <th className="px-6 py-5 font-semibold">Tư liệu</th>
                    <th className="px-6 py-5 font-semibold">Tài liệu tham khảo</th>
                    <th className="px-6 py-5 text-center font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(lectures) && lectures.length > 0 ? (
                    lectures.map((lecture, index) => (
                      <tr key={index} className="border-t border-slate-200 transition hover:bg-slate-50/70">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">{lecture.name}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {lecture.state || "opened"}
                          </span>
                        </td>
                        <td className="px-6 py-5 max-w-[260px] truncate">{lecture.material ? lecture.material : "N/A"}</td>
                        <td className="px-6 py-5 max-w-[260px] truncate">{lecture.reference || "N/A"}</td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <Button onClick={() => handleEditClick(lecture.id)} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                              Chỉnh sửa
                            </Button>
                            <Button onClick={() => handleDeleteClick(lecture.id)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100">
                              Xóa
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-slate-500">Chưa có bài giảng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {isEditModalOpen && selectedLecture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
              <h2 className="text-2xl font-semibold text-slate-900">Chỉnh sửa bài giảng</h2>
              <form onSubmit={handleEditFormSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tên bài giảng</label>
                  <input type="text" name="lectureName" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" defaultValue={selectedLecture.name} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Trạng thái</label>
                  <input type="text" name="lectureState" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" defaultValue={selectedLecture.state} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tài liệu tham khảo</label>
                  <input type="text" name="lectureReference" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" defaultValue={selectedLecture.reference} required />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="button-primary flex-1" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                  <Button type="button" onClick={() => setIsEditModalOpen(false)} className="button-secondary flex-1">
                    Hủy
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
              <h2 className="text-2xl font-semibold text-slate-900">Thêm bài giảng mới</h2>
              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tên bài giảng</label>
                  <input type="text" name="lectureName" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Trạng thái</label>
                  <input type="text" name="lectureState" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tư liệu bài giảng</label>
                  <input type="file" name="lectureMaterial" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tài liệu tham khảo</label>
                  <input type="text" name="lectureReference" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" required />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="button-primary flex-1">Thêm bài giảng</Button>
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

export default LectureSection;
