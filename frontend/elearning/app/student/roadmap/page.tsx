import BKNavbar2 from "@/components/BKNavbar2";
import Footer from "@/components/Footer";
import TableRoadmap from "@/components/TableRoadmap";

const RoadMap = () =>{
    return(
        <>
            <BKNavbar2 />
            <div className="px-8 py-8 flex flex-col items-center justify-center">
                <h2 className="font-bold text-4xl mb-4">Lộ trình hiện tại</h2>
                <div className="w-full">
                    <TableRoadmap/>
                </div>
            </div>
            <Footer/>
        </>
    );
};
export default RoadMap;