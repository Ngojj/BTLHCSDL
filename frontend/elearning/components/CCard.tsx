import React from "react";
import Image from 'next/image'
const CCard = () => {
    return (
        <div className=" flex flex-col bg-white rounded-md border-black border">
            <img className="w-full h-full rounded-t" src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D" width={100} height={100} />
            <div className="p-4">
                <h2 className="font-semibold text-gray-500">Tên khóa học</h2>
                <h4 className="text-xs">Giảng viên : Triết</h4>
                <h4 className="text-green-400 text-xs">Tổng số bài giảng : 44</h4>
                <h4 className="text-red-500 text-xs">Tổng thời gian : 4444</h4>
            </div>
        </div>
    );
}
export default CCard;