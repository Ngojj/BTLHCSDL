'use client';

import { useEffect, useState } from 'react';
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

// Shape of GET /analytics/teacher/overview — every figure below is computed by the database.
interface Overview {
  months: number;
  totals: {
    courses: number;
    enrollments: number;
    students: number;
    revenue: number;
    completed: number;
    avgProgress: number;
    quizAttempts: number;
    avgQuizScore: number | null;
  };
  revenueByMonth: { month: string; revenue: number; enrollments: number; growthPct: number | null }[];
  bestMonth: { month: string; revenue: number } | null;
  courses: { courseId: number; name: string; price: number; students: number; revenue: number; completionRate: number; avgScore: number | null; revenueRank: number }[];
  scoreDistribution: { bucket: string; count: number }[];
  recentActivity: { type: 'enroll' | 'complete'; at: string; student: string; course: string }[];
}

const DAY = 24 * 60 * 60 * 1000;

const shortMoney = (value: number) => {
  if (value >= 1_000_000) return { value: (value / 1_000_000).toFixed(1).replace('.', ','), unit: 'tr ₫' };
  if (value >= 1_000) return { value: Math.round(value / 1_000).toString(), unit: 'k ₫' };
  return { value: value.toString(), unit: '₫' };
};

const timeAgo = (date: string) => {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / DAY);
  if (days <= 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 30) return `${days} ngày trước`;
  return new Date(date).toLocaleDateString('vi-VN');
};

const growthText = (pct: number | null) =>
  pct === null ? 'Chưa có tháng trước để so sánh' : `${pct >= 0 ? '+' : ''}${pct.toString().replace('.', ',')}% so với tháng trước`;

const DashBoard = () => {
  const [userLogin, setUserLogin] = useRecoilState(userLoginState)
  const [overview, setOverview] = useState<Overview | null>(null);
  const [range, setRange] = useState<6 | 12>(12);
  const [loadError, setLoadError] = useState('');
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

  const fetchOverview = async () => {
    try {
      setLoadError('');
      setOverview(await request.get(`/analytics/teacher/overview?months=${range}`));
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoadError('Không thể tải số liệu dashboard. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (!userLogin.id) return;
    fetchOverview();
  }, [userLogin.id, range]);

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    try {
      const response = await request.del(`/course/delete/id/${id}`);
      if (response.message === "success") {
        fetchOverview();
      } else {
        alert('Xóa khóa học thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Đã có lỗi khi xóa khóa học.');
    }
  };

  const totals = overview?.totals;
  const months = overview?.revenueByMonth ?? [];
  const thisMonth = months[months.length - 1];
  const rangeTotal = months.reduce((sum, m) => sum + m.revenue, 0);
  const bestIndex = overview?.bestMonth ? months.findIndex((m) => m.month === overview.bestMonth!.month) : -1;
  const revenue = shortMoney(totals?.revenue ?? 0);
  const courseRows = [...(overview?.courses ?? [])].sort((a, b) => b.students - a.students).slice(0, 6);
  const maxStudents = Math.max(1, ...courseRows.map((c) => c.students));
  const scoreBuckets = overview?.scoreDistribution ?? [];
  const maxBucket = Math.max(1, ...scoreBuckets.map((b) => b.count));
  const perfect = scoreBuckets.find((b) => b.bucket === '10')?.count ?? 0;
  const teacherName = userLogin.lastName || userLogin.firstName;

  const kpis = [
    { label: 'Khóa học', value: String(totals?.courses ?? 0), unit: '', note: `${overview?.courses.filter((c) => c.students > 0).length ?? 0} khóa có học viên` },
    { label: 'Sinh viên', value: (totals?.students ?? 0).toLocaleString('vi-VN'), unit: '', note: `+${thisMonth?.enrollments ?? 0} lượt đăng ký tháng này` },
    { label: 'Doanh thu', value: revenue.value, unit: revenue.unit, note: growthText(thisMonth?.growthPct ?? null), highlight: true },
    { label: 'Điểm quiz TB', value: totals?.avgQuizScore != null ? totals.avgQuizScore.toFixed(1).replace('.', ',') : '—', unit: totals?.avgQuizScore != null ? '/10' : '', note: `Trên ${(totals?.quizAttempts ?? 0).toLocaleString('vi-VN')} lượt làm` },
  ];

  const chartData = {
    labels: months.map((m) => `T${Number(m.month.slice(5))}`),
    datasets: [
      {
        data: months.map((m) => m.revenue / 1_000_000),
        borderColor: '#032B91',
        borderWidth: 2,
        backgroundColor: 'rgba(20, 136, 219, 0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: months.map((_, i) => (i === bestIndex ? 6 : 3)),
        pointBackgroundColor: months.map((_, i) => (i === bestIndex ? '#C9A227' : '#ffffff')),
        pointBorderColor: months.map((_, i) => (i === bestIndex ? '#C9A227' : '#032B91')),
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

      {loadError && (
        <div className="flex items-center justify-between rounded-md border-l-2 border-[#C2410C] bg-orange-50 px-4 py-3 text-sm text-[#9A3412]">
          {loadError}
          <button type="button" className="font-semibold underline" onClick={fetchOverview}>Thử lại</button>
        </div>
      )}

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
            <span className="font-mono text-[11px] text-bk-slate">Σ {totals?.enrollments ?? 0}</span>
          </div>
          <ul className="mt-6 space-y-4">
            {courseRows.length > 0 ? courseRows.map((course, index) => (
              <li key={course.courseId}>
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
              {overview && overview.courses.length > 0 ? overview.courses.slice(0, 6).map((course) => (
                <tr key={course.courseId}>
                  <td className="px-6 py-3">
                    <p className="font-medium text-bk-ink">{course.name}</p>
                    <p className="font-mono text-[10px] text-bk-slate">
                      #{String(course.courseId).padStart(4, '0')} · {course.students} SV · hạng {course.revenueRank}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-bk-ink">{course.price > 0 ? formatVnd(course.price) : 'Miễn phí'}</td>
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
                    {overview ? (
                      <>Chưa có khóa học nào. <Link href="/teacher/create" className="font-semibold text-bk-blue">Tạo khóa học</Link></>
                    ) : 'Đang tải...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-bk-ink">Phân bố điểm quiz</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bk-slate">{totals?.quizAttempts ?? 0} lượt</span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-2">
            {scoreBuckets.map((bucket) => (
              <div key={bucket.bucket} className="flex flex-1 flex-col items-center justify-end gap-1.5 self-stretch">
                <span className="font-mono text-[10px] text-bk-slate">{bucket.count}</span>
                <div
                  className="w-full rounded-t-[3px]"
                  style={{
                    height: `${Math.max(4, (bucket.count / maxBucket) * 100)}%`,
                    background: bucket.bucket === '10' ? 'var(--bk-gold)' : bucket.count === maxBucket ? 'var(--bk-navy)' : '#9CCBEF',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 font-mono text-[10px] text-bk-slate">
            {scoreBuckets.map((bucket) => (
              <span key={bucket.bucket} className="flex-1 text-center">{bucket.bucket}</span>
            ))}
          </div>
          <p className="mt-4 text-xs text-bk-slate">
            <span className="font-semibold text-[#8A6D12]">{perfect}</span> lượt đạt 10/10
            {totals?.avgQuizScore != null && <> · điểm trung bình {totals.avgQuizScore.toFixed(1).replace('.', ',')}</>}
          </p>
        </section>

        <section className="card p-6">
          <h2 className="text-base font-semibold text-bk-ink">Hoạt động gần đây</h2>
          <ul className="mt-5 space-y-4">
            {overview && overview.recentActivity.length > 0 ? overview.recentActivity.slice(0, 5).map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.type === 'complete' ? 'bg-[#1F8A5B]' : 'bg-bk-blue'}`} />
                <div>
                  <p className="text-sm leading-5 text-bk-ink">
                    {item.student} {item.type === 'complete' ? 'hoàn thành' : 'đăng ký'}{' '}
                    <span className="font-medium">{item.course}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bk-slate">{timeAgo(item.at)}</p>
                </div>
              </li>
            )) : (
              <li className="text-sm text-bk-slate">{overview ? 'Chưa có hoạt động.' : 'Đang tải...'}</li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default DashBoard;
