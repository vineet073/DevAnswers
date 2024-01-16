import Navbar from "@/components/common/Navbar/Navbar";
import LeftSideBar from "@/components/common/Sidebar/LeftSideBar";
import RightSideBar from "@/components/common/Sidebar/RightSideBar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSideBar/>

        <div className='flex flex-1 flex-col px-6 pb-6 pt-32'>
          <div className="mx-auto w-full max-w-5xl">
            {children}
          </div>
        </div>

        <RightSideBar/>
      </div>
    </div>
  );
};

export default Layout;
