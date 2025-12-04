import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bg-gradient-to-r from-blue-800 to-gray-900 text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4 text-center tracking-wide">
          CO2014 - DATABASE SYSTEM
        </h1>
        <h2 className="text-xl font-semibold mb-2 text-center">
          Contributor:
        </h2>
        <ul className="list-none flex flex-wrap justify-center gap-4 text-lg">
          <li className="bg-blue-700 hover:bg-blue-600 rounded-full px-4 py-2 transition duration-300">
            Nguyễn Minh Triết
          </li>
          <li className="bg-blue-700 hover:bg-blue-600 rounded-full px-4 py-2 transition duration-300">
            Lâm Vũ
          </li>
          <li className="bg-blue-700 hover:bg-blue-600 rounded-full px-4 py-2 transition duration-300">
            Trần Trung Nhựt
          </li>
          <li className="bg-blue-700 hover:bg-blue-600 rounded-full px-4 py-2 transition duration-300">
            Võ Quang Đại Việt
          </li>
        </ul>
        <div className="mt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
