import BKNavbar2 from "@/components/BKNavbar2";
import TableScore from "@/components/TableScore";

const Tablescore = () =>{
    return(
        <>
        <BKNavbar2 />
        <div className="px-8 py-8 flex flex-col items-center justify-center">
            <h2 className="font-bold text-4xl mb-4">Bảng điểm</h2>
            <div className="w-full">
                <TableScore />
            </div>
        </div>
        </>
    );
}
export default Tablescore;