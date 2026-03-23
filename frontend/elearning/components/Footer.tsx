const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white/90">
      <div className="section-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">
              CO2014 Database System
            </span>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-slate-900">
              Giao diện học tập rõ ràng, gọn gàng và phù hợp với một hệ thống e-learning dùng hằng ngày.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Hệ thống ưu tiên tính dễ dùng trong điều hướng, quản lý khóa học, bài giảng, quiz và lộ trình học
              để người học lẫn giảng viên đều thao tác thuận tiện hơn.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Định hướng</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Thiết kế tối giản, dễ đọc, nhấn mạnh vào dữ liệu học tập thay vì hiệu ứng.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Mục tiêu</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Tạo trải nghiệm đủ chuyên nghiệp để có thể dùng như một cổng học tập thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
