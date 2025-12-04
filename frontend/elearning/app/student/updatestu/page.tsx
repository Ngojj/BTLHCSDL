"use client"
import request from "@/app/axios/axios";
import { defaultStudent, StudentDto } from "@/app/dtos/student.dto";
import { userLoginState } from "@/state";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const UpdateInfo = () => {
  const [student, setStudent] = useState<StudentDto>(defaultStudent)
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const user = useRecoilValue(userLoginState);
  const router = useRouter();

  const handleIschanging = async () => {
    setIsChanging(!isChanging);

    try {
      const response = await request.put(`/student/update`, {
        id: student.id,
        firstName,
        lastName,
        email,
        bankName,
        bankAccount
      });

      alert("Thay đổi thông tin thành công!")
    } catch (e) {
      alert("Không thể lưu thông tin vào lúc này! Vui lòng thử lại sau");
    }
  };

  const handleNotIschanging = () => {
    setIsChanging(!isChanging);
  };

  const fetchStudent = async () => {
    try {
      const response = await request.get(`/student/${user.id}`);
      const data = response.data.data;
      setStudent(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setBankName(data.bankName);
      setBankAccount(data.bankAccount);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full p-8">
        <h1 className="text-center text-5xl text-blue-600 mb-6">
          <b>Thông tin sinh viên</b>
        </h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Mã số sinh viên
            </label>
            <input
              disabled={true}
              value={student.studentId}
              className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Họ
              </label>
              <input
                disabled={!isChanging}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} 
                type="text"
                className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Tên
              </label>
              <input
                disabled={!isChanging}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} 
                type="text"
                className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Địa chỉ email
            </label>
            <input
              disabled={!isChanging}
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              type="email"
              className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Tên ngân hàng
              </label>
              <input
                disabled={!isChanging}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)} 
                type="text"
                className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Số tài khoản
              </label>
              <input
                disabled={!isChanging}
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)} 
                type="text"
                className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Ngày tham gia
            </label>
            <input
              disabled={true}
              value={student.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : ''}  // Convert date to YYYY-MM-DD format
              type="date"
              className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Số khóa học đã đăng ký
              </label>
              <input
                disabled={true}
                value={student.numberCourseEnrolled}
                type="number"
                className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Số khóa học đã hoàn thành
              </label>
              <input
                disabled={true}
                type="number"
                value={student.numberCourseCompleted}
                className="mt-2 block w-full rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-700 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => {
                router.push('/');
              }}
            >
              Quay lại
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => {
                isChanging ? handleIschanging() : handleNotIschanging();
              }}
            >
              {isChanging ? "Lưu thay đổi" : "Thay đổi thông tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfo;
