'use client';

import { post } from '@/app/axios/axios';
import { userLoginState } from '@/state';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const CreateCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [language, setLanguage] = useState('Vietnamese');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [averageQuizScore, setAverageQuizScore] = useState('0');
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [certiName, setCertiName] = useState('');
  const [expirationTime, setExpirationTime] = useState<number>(0);
  const user = useRecoilValue(userLoginState);
  const router = useRouter();

  const handleAddTopic = () => {
    const normalizedTopic = currentTopic.trim();

    if (normalizedTopic && !topics.includes(normalizedTopic)) {
      setTopics((prev) => [...prev, normalizedTopic]);
      setCurrentTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics((prev) => prev.filter((topic) => topic !== topicToRemove));
  };

  const handleAddCourse = async () => {
    const normalizedCourseName = courseName.trim();
    const normalizedDescription = description.trim();
    const normalizedTopics = topics.map((topic) => topic.trim()).filter(Boolean);
    const normalizedPrice = Number(price);
    const normalizedAvgQuiz = Number(averageQuizScore);

    if (!normalizedCourseName || !normalizedDescription || normalizedTopics.length === 0) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    if (Number.isNaN(normalizedPrice) || normalizedPrice < 0) {
      alert('Học phí không hợp lệ.');
      return;
    }

    if (Number.isNaN(normalizedAvgQuiz) || normalizedAvgQuiz < 0) {
      alert('Điểm quiz trung bình không hợp lệ.');
      return;
    }

    try {
      if (!user.token) {
        alert('Vui lòng đăng nhập để tạo khóa học.');
        return;
      }

      await post('/course/create', {
        courseName: normalizedCourseName,
        language,
        description: normalizedDescription,
        price: normalizedPrice,
        avgQuiz: normalizedAvgQuiz,
        topics: normalizedTopics,
        teacherId: Number(user.id),
      });

      alert('Tạo khóa học thành công.');
      router.back();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const message =
          typeof error.response.data?.message === 'string'
            ? error.response.data.message
            : 'Có lỗi xảy ra, vui lòng thử lại sau.';

        alert(message);
        return;
      }

      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <main className="section-shell py-10 sm:py-14">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            Trình tạo khóa học
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Tạo khóa học mới
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Thiết lập thông tin cốt lõi của khóa học, mô tả nội dung, học phí và nhóm chủ đề để chuẩn
            bị cho toàn bộ flow giảng dạy phía sau.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Gợi ý</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Đặt tên khóa học ngắn gọn, mô tả rõ mục tiêu học tập và thêm ít nhất 2-3 chủ đề để khóa
                học dễ được nhận diện hơn.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Thông tin bổ sung
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>
                  Tên chứng chỉ: <span className="font-medium text-slate-800">{certiName || 'Chưa nhập'}</span>
                </p>
                <p>
                  Thời hạn chứng chỉ:{' '}
                  <span className="font-medium text-slate-800">{expirationTime || 0} tháng</span>
                </p>
                <p>
                  Số chủ đề hiện tại: <span className="font-medium text-slate-800">{topics.length}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Tên khóa học</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Ngôn ngữ</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                <option value="Vietnamese">Vietnamese</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Học phí (VND)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Mô tả khóa học</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Điểm quiz trung bình</label>
              <input
                type="number"
                value={averageQuizScore}
                onChange={(e) => setAverageQuizScore(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Tên chứng chỉ</label>
              <input
                type="text"
                value={certiName}
                onChange={(e) => setCertiName(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Thời hạn chứng chỉ sau khi hoàn thành (tháng)
              </label>
              <input
                type="number"
                value={expirationTime}
                onChange={(e) => setExpirationTime(Number(e.target.value))}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Chủ đề</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  className="block flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  placeholder="Nhập chủ đề và thêm vào danh sách"
                />
                <button type="button" onClick={handleAddTopic} className="button-secondary">
                  Thêm
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRemoveTopic(topic)}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    {topic} ×
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="button-primary flex-1" onClick={handleAddCourse}>
              Tạo khóa học
            </button>
            <button type="button" className="button-secondary flex-1" onClick={() => router.back()}>
              Quay lại
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CreateCourse;
