import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-gradient-to-b flex flex-col">
      <header className="text-center py-4 bg-cover bg-center text-white bg-blue-500" >
        <h1 className="text-5xl font-bold">Về chúng tôi</h1>

      </header>

      <main className="flex flex-col items-center space-y-8 bg-blue-500">
           <div
            className="flex flex-col md:flex-row items-center justify-between bg-white border-black border-2 text-black w-4/5 max-w-4xl rounded-lg shadow-lg p-6 space-y-4 md:space-y-0"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold">Trần Trung Nhựt</h2>
              <p className="mt-2">MSSV: 2212483</p>
              <p className="mt-2">Khoa: Khoa học và Kỹ thuật Máy tính</p>
              <p className="mt-2">Ngành học: Khoa học máy tính</p>
              <p className="mt-2">Mô tả: Ông vua của họ nhà Lào</p>
            </div>
            <div className="w-32 h-32 bg-gray-300 rounded-lg">
              <img src='https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/438300394_1554031472043625_2442106734554500076_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEUCqVfgPerJ03wh-ftOvwbMuVOikE9w1oy5U6KQT3DWkz9hlmf5QPIm7eo9etn0H_SI1240rhQjtWS8zFgo43J&_nc_ohc=q7HvJU-lELkQ7kNvgH4dCJX&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=AYkOZU88YyrQCmThwU1Peov&oh=00_AYCz_53OZNjxntBkbOn4wEYrHkSPoNGNCk74SIl0dMz-8Q&oe=6757554C'/>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between bg-white border-black border-2 text-black w-4/5 max-w-4xl rounded-lg shadow-lg p-6 space-y-4 md:space-y-0"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold">Võ Quang Đại Việt</h2>
              <p className="mt-2">MSSV: ...</p>
              <p className="mt-2">Khoa: Khoa học và Kỹ thuật Máy tính</p>
              <p className="mt-2">Ngành học: Khoa học máy tính</p>
              <p className="mt-2">Mô tả: </p>
            </div>
            <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between bg-white border-black border-2 text-black w-4/5 max-w-4xl rounded-lg shadow-lg p-6 space-y-4 md:space-y-0"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold">Lâm Vũ</h2>
              <p className="mt-2">MSSV: ...</p>
              <p className="mt-2">Khoa: Khoa học và Kỹ thuật Máy tính</p>
              <p className="mt-2">Ngành học: Khoa học máy tính</p>
              <p className="mt-2">Mô tả: </p>
            </div>
            <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between bg-white border-black border-2 text-black w-4/5 max-w-4xl rounded-lg shadow-lg p-6 space-y-4 md:space-y-0"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold">Nguyễn Minh Triết</h2>
              <p className="mt-2">MSSV: ...</p>
              <p className="mt-2">Khoa: Khoa học và Kỹ thuật Máy tính</p>
              <p className="mt-2">Ngành học: Khoa học máy tính</p>
              <p className="mt-2">Mô tả: </p>
            </div>
            <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
          </div>
      </main>
    </div>
  );
};

export default AboutPage;