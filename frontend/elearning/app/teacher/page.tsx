'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Pencil, Trash2 } from 'lucide-react';
import { userLoginState } from '@/state';
import * as request from '@/app/axios/axios';
import { formatVnd } from '@/components/CourseCard';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

interface Course {
  courseId: number;
  courseName: string;
  language: string;
  description: string;
  creationTime: string;
  price: number | string;
}

interface JoinRecord {
  studentId: number;
  courseId: number;
  courseName: string;
  price: number;
  progress: number;
  dateStart: string;
  dateComplete: string | null;
}

const DAY = 24 * 60 * 60 * 1000;

const shortMoney = (value: number) => {
  if (value >= 1_000_000) return { value: (value / 1_000_000).toFixed(1).replace('.', ','), unit: 'tr ₫' };
  if (value >= 1_000) return { value: Math.round(value / 1_000).toString(), unit: 'k ₫' };
  return { value: value.toString(), unit: '₫' };
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / DAY);
  if (days <= 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 30) return `${days} ngày trước`;
  return new Date(date).toLocaleDateString('vi-VN');
};

const DashBoard = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [courses, setCourses] = useState<Course[]>([]);
  const [joins, setJoins] = useState<JoinRecord[]>([]);
  const [range, setRange] = useState<6 | 12>(12);
  const router = useRouter()

  useEffect(() => {
    const userFromSessionRaw = sessionStorage.getItem('userLogin')
    if(!userFromSessionRaw) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userFromSessionRaw)
    setUserLogin(parsedUser)

    if (String(parsedUser.role || '').toLowerCase() !== 'teacher') {
      router.push('/')
    }
  }, [router, setUserLogin])

  const fetchCourses = async () => {
    try {
      const response = await request.get(`/course/teacherId/${userLogin.id}`);
      if (response.status === 200) setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchJoinData = async () => {
    try {
      const response = await request.get(`/join/teacherId/${userLogin.id}`);
      setJoins(response.status === 200 ? response.data : []);
    } catch (error) {
      console.error('Error fetching join data:', error);
      setJoins([]);
    }
  };

  useEffect(() => {
    if (!userLogin.id) return;
    fetchCourses();
    fetchJoinData();
  }, [userLogin.id]);

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    try {
      const response = await request.del(`/course/delete/id/${id}`);
      if (response.message === "success") {
        fetchCourses();
      } else {
        alert('Xóa khóa học thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Đã có lỗi khi xóa khóa học.');
    }
  };

  const stats = useMemo(() => {
    const recent = joins.filter((j) => Date.now() - new Date(j.dateStart).getTime() <= 30 * DAY);
    const revenue = joins.reduce((sum, j) => sum + Number(j.price || 0), 0);
    const completed = joins.filter((j) => j.progress === 100).length;
    const avgProgress = joins.length ? Math.round(joins.reduce((s, j) => s + j.progress, 0) / joins.length) : 0;

    const byCourse = new Map<number, { name: string; students: number }>();
    joins.forEach((j) => {
      const item = byCourse.get(j.courseId) || { name: j.courseName, students: 0 };
      item.students += 1;
      byCourse.set(j.courseId, item);
    });

    const progressBuckets = [0, 0, 0, 0, 0, 0];
    joins.forEach((j) => {
      progressBuckets[j.progress >= 100 ? 5 : Math.floor(j.progress / 20)] += 1;
    });

    return {
      students: new Set(joins.map((j) => j.studentId)).size,
      newStudents: new Set(recent.map((j) => j.studentId)).size,
      revenue,
      recentRevenue: recent.reduce((sum, j) => sum + Number(j.price || 0), 0),
      completed,
      avgProgress,
      byCourse,
      progressBuckets,
    };
  }, [joins]);

  const monthly = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: range }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (range - 1 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: `T${d.getMonth() + 1}`, value: 0 };
    });
    joins.forEach((j) => {
      const d = new Date(j.dateStart);
      const month = months.find((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (month) month.value += Number(j.price || 0);
    });
    return months;
  }, [joins, range]);

  const maxIndex = monthly.reduce((best, m, i) => (m.value > monthly[best].value ? i : best), 0);
  const rangeTotal = monthly.reduce((sum, m) => sum + m.value, 0);

  const chartData = {
    labels: monthly.map((m) => m.label),
    datasets: [
      {
        data: monthly.map((m) => m.value / 1_000_000),
        borderColor: '#032B91',
        borderWidth: 2,
        backgroundColor: 'rgba(20, 136, 219, 0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: monthly.map((_, i) => (i === maxIndex && monthly[i].value > 0 ? 6 : 3)),
        pointBackgroundColor: monthly.map((_, i) => (i === maxIndex && monthly[i].value > 0 ? '#C9A227' : '#ffffff')),
        pointBorderColor: monthly.map((_, i) => (i === maxIndex && monthly[i].value > 0 ? '#C9A227' : '#032B91')),
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0B1B3F',
        padding: 10,
        displayColors: false,
        callbacks: { label: (ctx) => formatVnd(Math.round(Number(ctx.raw) * 1_000_000)) },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: '#DCE3F0' },
        ticks: { color: '#5B6B8C', font: { family: 'var(--font-mono)', size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#EEF2F8' },
        border: { display: false },
        ticks: { color: '#5B6B8C', font: { family: 'var(--font-mono)', size: 10 }, callback: (v) => `${v}tr` },
      },
    },
  };

  const activities = useMemo(() => {
    const items = joins.flatMap((j) => {
      const list: { date: string; type: 'join' | 'done'; j: JoinRecord }[] = [{ date: j.dateStart, type: 'join', j }];
      if (j.dateComplete) list.push({ date: j.dateComplete, type: 'done', j });
      return list;
    });
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [joins]);

  const revenue = shortMoney(stats.revenue);
  const courseRows = Array.from(stats.byCourse.values()).sort((a, b) => b.students - a.students).slice(0, 6);
  const maxStudents = Math.max(1, ...courseRows.map((c) => c.students));
  const maxBucket = Math.max(1, ...stats.progressBuckets);
  const teacherName = userLogin.lastName || userLogin.firstName;

  const kpis = [
    { label: 'Khóa học', value: String(courses.length), unit: '', note: `${stats.byCourse.size} khóa có học viên` },
    { label: 'Sinh viên', value: stats.students.toLocaleString('vi-VN'), unit: '', note: `+${stats.newStudents} trong 30 ngày` },
    { label: 'Doanh thu', value: revenue.value, unit: revenue.unit, note: `+${formatVnd(stats.recentRevenue)} trong 30 ngày`, highlight: true },
    { label: 'Tiến độ TB', value: String(stats.avgProgress), unit: '%', note: `${stats.completed} lượt hoàn thành` },
  ];

  return (
    <main className="space-y-5 px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Tổng quan · {range} tháng gần nhất</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-bk-ink sm:text-4xl">
            Chào {teacherName ? `thầy/cô ${teacherName}` : 'bạn'}, <span className="text-bk-navy">chúc một ngày tốt lành.</span>
          </h1>
        </div>
        <div className="flex gap-1 rounded-lg border border-bk-line bg-white p-1">
          {([12, 6] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                range === value ? 'bg-bk-navy font-semibold text-white' : 'text-bk-slate hover:text-bk-ink'
              }`}
            >
              {value} tháng
            </button>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-[10px] border p-5 ${
              kpi.highlight ? 'bp-grid-dark border-bk-navy bg-bk-navy text-white' : 'border-bk-line bg-white'
            }`}
          >
            <p className={`font-mono text-[10px] uppercase tracking-[0.16em] ${kpi.highlight ? 'text-white/60' : 'text-bk-slate'}`}>
              {kpi.label}
            </p>
            <p className={`mt-3 font-display text-4xl font-semibold ${kpi.highlight ? 'text-white' : 'text-bk-ink'}`}>
              {kpi.value}
              {kpi.unit && <span className={`ml-1 text-base ${kpi.highlight ? 'text-white/60' : 'text-bk-slate'}`}>{kpi.unit}</span>}
            </p>
            <p className={`mt-2 text-xs ${kpi.highlight ? 'text-white/70' : 'text-bk-slate'}`}>{kpi.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <section className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-bk-ink">Doanh thu theo tháng</h2>
              <p className="mt-1 font-display text-2xl font-semibold text-bk-ink">{formatVnd(rangeTotal)}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-bk-slate">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-bk-navy" /> Doanh thu</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-bk-gold" /> Tháng cao nhất</span>
            </div>
          </div>
          <div className="mt-6 h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-bk-ink">Sinh viên theo khóa</h2>
            <span className="font-mono text-[11px] text-bk-slate">Σ {joins.length}</span>
          </div>
          <ul className="mt-6 space-y-4">
            {courseRows.length > 0 ? courseRows.map((course, index) => (
              <li key={course.name}>
                <div className="flex justify-between text-sm">
                  <span className="truncate pr-4 text-bk-ink">{course.name}</span>
                  <span className="font-mono text-xs text-bk-slate">{course.students}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-bk-mist">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(course.students / maxStudents) * 100}%`,
                      background: index === 0 ? 'var(--bk-navy)' : index < 3 ? 'var(--bk-blue)' : '#9CCBEF',
                    }}
                  />
                </div>
              </li>
            )) : (
              <li className="py-10 text-center text-sm text-bk-slate">Chưa có lượt đăng ký nào.</li>
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr_0.9fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-base font-semibold text-bk-ink">Khóa học của tôi</h2>
            <Link href="/teacher/courses" className="button-link text-xs">Quản lý</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="border-y border-bk-line bg-bk-mist/60 font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">
              <tr>
                <th className="px-6 py-2.5 text-left font-normal">Khóa học</th>
                <th className="px-3 py-2.5 text-right font-normal">Học phí</th>
                <th className="px-6 py-2.5 text-right font-normal"><span className="sr-only">Thao tác</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bk-line">
              {courses.length > 0 ? courses.slice(0, 6).map((course) => (
                <tr key={course.courseId}>
                  <td className="px-6 py-3">
                    <p className="font-medium text-bk-ink">{course.courseName}</p>
                    <p className="font-mono text-[10px] text-bk-slate">#{String(course.courseId).padStart(4, '0')} · {stats.byCourse.get(course.courseId)?.students || 0} SV</p>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-bk-ink">{formatVnd(course.price)}</td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label="Sửa khóa học"
                        className="rounded-md p-1.5 text-bk-slate hover:bg-bk-mist hover:text-bk-navy"
                        onClick={() => router.push(`/teacher/edit_course/${course.courseId}`)}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa khóa học"
                        className="rounded-md p-1.5 text-bk-slate hover:bg-orange-50 hover:text-[#C2410C]"
                        onClick={() => handleDeleteCourse(course.courseId)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-sm text-bk-slate">
                    Chưa có khóa học nào. <Link href="/teacher/create" className="font-semibold text-bk-blue">Tạo khóa học</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-bk-ink">Phân bố tiến độ</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">{joins.length} lượt</span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-2">
            {stats.progressBuckets.map((count, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-1.5 self-stretch">
                <span className="font-mono text-[10px] text-bk-slate">{count}</span>
                <div
                  className="w-full rounded-t-[3px]"
                  style={{
                    height: `${Math.max(4, (count / maxBucket) * 100)}%`,
                    background: index === 5 ? 'var(--bk-gold)' : count === maxBucket ? 'var(--bk-navy)' : '#9CCBEF',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 font-mono text-[10px] text-bk-slate">
            {['<20', '20', '40', '60', '80', '100'].map((label) => (
              <span key={label} className="flex-1 text-center">{label}</span>
            ))}
          </div>
          <p className="mt-4 text-xs text-bk-slate">
            <span className="font-semibold text-[#8A6D12]">{stats.completed}</span> lượt đã hoàn thành 100% · trung bình {stats.avgProgress}%
          </p>
        </section>

        <section className="card p-6">
          <h2 className="text-base font-semibold text-bk-ink">Hoạt động gần đây</h2>
          <ul className="mt-5 space-y-4">
            {activities.length > 0 ? activities.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.type === 'done' ? 'bg-[#1F8A5B]' : 'bg-bk-blue'}`} />
                <div>
                  <p className="text-sm leading-5 text-bk-ink">
                    Sinh viên #{item.j.studentId} {item.type === 'done' ? 'hoàn thành' : 'đăng ký'}{' '}
                    <span className="font-medium">{item.j.courseName}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bk-slate">{timeAgo(item.date)}</p>
                </div>
              </li>
            )) : (
              <li className="text-sm text-bk-slate">Chưa có hoạt động.</li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default DashBoard;
