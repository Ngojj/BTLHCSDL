'use client';
import { useEffect, useState } from "react";
import Header from "../../teacher_components/header"
import Sidebar from "../../teacher_components/sidebar"
import { Button } from '@/components/ui/button';
import { userLoginState } from "@/state";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import * as request from '@/app/axios/axios'

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
    onEdit: (id: string) => void;
    onDetailQuiz: (id: string) => void;
    onDetailLecture: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                        <th className="px-6 py-5 font-semibold">STT</th>
                        <th className="px-6 py-5 font-semibold">Học phần</th>
                        <th className="px-6 py-5 font-semibold text-center">Bài giảng</th>
                        <th className="px-6 py-5 font-semibold text-center">Ngày tạo</th>
                        <th className="px-6 py-5 font-semibold text-center">Thời gian hoàn thành</th>
                        <th className="px-6 py-5 font-semibold text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((section, index) => (
                        <tr key={section.id} className="border-t border-slate-200 transition hover:bg-slate-50/70">
                            <td className="px-6 py-5">
                                <span className="inline-flex min-w-10 justify-center rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">
                                    {index + 1}
                                </span>
                            </td>
                            <td className="px-6 py-5">
                                <p className="font-semibold text-slate-900">{section.name || "Đang tải"}</p>
                            </td>
                            <td className="px-6 py-5 text-center">{section.numOfLecture}</td>
                            <td className="px-6 py-5 text-center">{section.creTime}</td>
                            <td className="px-6 py-5 text-center">{section.timeToComplete} phút</td>
                            <td className="px-6 py-5">
                                <div className="flex flex-wrap justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(section.id)}
                                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => onDetailQuiz(section.id)}
                                        className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                    >
                                        Quiz
                                    </button>
                                    <button
                                        onClick={() => onDetailLecture(section.id)}
                                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                        Bài giảng
                                    </button>
                                    <button
                                        onClick={() => onDelete(section.id)}
                                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-xl">
            <span className="text-sm font-medium text-slate-600">Đang tải dữ liệu...</span>
        </div>
    </div>
);

const EditCoursePage = ({ params }: { params: Promise<{ courseId: string }> }) => {
    const [loading, setLoading] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const [rtnParams, setRtnParams] = useState<{ courseId: string }>({ courseId: "" });
    const [sections, setSections] = useState<Section[]>([]);
    const [course, setCourse] = useState<any>({});
    const [userLogin, setUserLogin] = useRecoilState(userLoginState)
    
    useEffect(() => {
        const loadParams = async () => {
            const unwrappedParams = await params;
            return { courseId: unwrappedParams.courseId };
        }

        loadParams().then((res) => setRtnParams(res));

        const userFromSessionRaw = sessionStorage.getItem('userLogin')
        if(!userFromSessionRaw) return
        setUserLogin(JSON.parse(userFromSessionRaw))  
    }, [])

    const fetchSections = async () => {
        if (!rtnParams.courseId) return;
        try {
            setLoading(true)
            const response = await request.get(`/section/course/${rtnParams.courseId}`);
            if (response.status === 200){
                setSections(response.data);
            } else {
                setSections([]);
            }
        } catch (error) {
            console.log("Failed to fetch sections: ", error);
            setSections([]);
        } finally {
            setLoading(false)
        }
    }

    const fetchCourse = async () => {
        if (!rtnParams.courseId) return;
        try {
            setLoading(true)
            const response = await request.get(`/course/id/${rtnParams.courseId}`);
            if (response.message === "success"){
                setCourse(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch course");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSections();
        fetchCourse();
    }, [rtnParams]);

    const handleEdit = (id: string) => {
        const section = sections.find((s) => s.id === id);
        if (section) {
            setEditingSection(section);
            setIsEditing(true);
        }
    };
    
    const handleEditDetailQuiz = (id: string) => {
        router.push(`/teacher/edit_section/quiz/${id}`)
    }

    const handleEditDetailLecture = (id: string) => {
        router.push(`/teacher/edit_section/lecture/${id}`)
    }

    const handleDeleteSection = async (id: string) => {
        if (!id) {
            alert("Mã học phần không hợp lệ.");
            return;
        }
    
        if (confirm("Bạn có chắc muốn xóa học phần này?")) {
            setLoading(true);
            try {
                const response = await request.del(`/section/delete/${id}`);
                if (response.status === 200) {
                    alert("Xóa học phần thành công.");
                    fetchSections();
                } else {
                    alert("Không thể xóa học phần.");
                }
            } catch (error) {
                console.error("Error deleting section:", error);
                alert("Có lỗi xảy ra khi xóa học phần.");
            } finally {
                setLoading(false);
            }
        }
    };
    
    const handleAddSection = async () => {
        if (!confirm("Bạn có muốn thêm học phần mới?")) return;

        const newSection = {
            name: `Học phần ${sections.length + 1}`,
            numOfLecture: 0,
            timeToComplete: 0,
            courseId: parseInt(rtnParams.courseId),
            teacherId: parseInt(userLogin.id)
        };

        try {
            const res = await request.post(`/section/create`, newSection);
            if (res.status === 200){
                fetchSections();
            }
        } catch (error) {
            console.log("Failed to add section: ", error);
        }
    };

    if (loading) {
        return <LoadingOverlay />
    }

    return (
        <main className="section-shell py-8">
            <div className="grid min-h-screen grid-cols-12 gap-6">
                <div className="col-span-12">
                    {Header(userLogin.lastName + ' ' + userLogin.firstName)}
                </div>
                {Sidebar(userLogin.firstName, userLogin.lastName)}

                {isEditing && editingSection && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
                            <h2 className="text-2xl font-semibold text-slate-900">Chỉnh sửa học phần</h2>
                            <form
                                className="mt-6 space-y-4"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    try {
                                        const res = await request.patch(`/section/update`, editingSection);
                                        if (res.status === 200) {
                                            setIsEditing(false);
                                            fetchSections();
                                        }
                                    } catch (error) {
                                        console.error("Failed to update section: ", error);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Tên học phần</label>
                                    <input
                                        type="text"
                                        value={editingSection.name}
                                        onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Số bài giảng</label>
                                    <input
                                        type="number"
                                        value={editingSection.numOfLecture}
                                        onChange={(e) =>
                                            setEditingSection({ ...editingSection, numOfLecture: parseInt(e.target.value) })
                                        }
                                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Thời gian hoàn thành (phút)</label>
                                    <input
                                        type="number"
                                        value={editingSection.timeToComplete}
                                        onChange={(e) =>
                                            setEditingSection({ ...editingSection, timeToComplete: parseInt(e.target.value) })
                                        }
                                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button type="button" onClick={() => setIsEditing(false)} className="button-secondary flex-1">
                                        Hủy
                                    </Button>
                                    <Button type="submit" className="button-primary flex-1">
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <section className="col-span-10 rounded-[30px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-8 py-7">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                                    Course Structure
                                </span>
                                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                                    {course.courseName}
                                </h1>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    Quản lý các học phần, bài giảng và quiz trong khóa học từ một không gian làm việc thống nhất hơn.
                                </p>
                            </div>
                            <Button className="button-primary" onClick={handleAddSection}>
                                Thêm học phần
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        <SectionTable
                            sections={sections}
                            onEdit={handleEdit}
                            onDetailQuiz={handleEditDetailQuiz}
                            onDetailLecture={handleEditDetailLecture}
                            onDelete={handleDeleteSection}
                        />
                    </div>
                </section>
            </div>
        </main>
    )
}

export default EditCoursePage
