import BKNavbar2 from "@/components/BKNavbar2";
import Footer from "@/components/Footer";
import TableRoadmap from "@/components/TableRoadmap";

const RoadMap = () =>{
    return(
        <>
            <BKNavbar2 />
            <main className="section-shell py-10 sm:py-14">
                <section className="mb-8 rounded-[34px] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
                    <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                        Learning Planner
                    </span>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                        Lộ trình hiện tại
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                        Tổng hợp các lộ trình học được đề xuất cho bạn, giúp theo dõi hướng đi rõ ràng hơn thay vì chỉ xem từng khóa học riêng lẻ.
                    </p>
                </section>
                <TableRoadmap/>
            </main>
            <Footer/>
        </>
    );
};

export default RoadMap;
