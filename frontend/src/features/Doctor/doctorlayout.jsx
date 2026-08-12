import { Outlet } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";

const DoctorLayout = () => {
  return (
    <div className="min-h-screen bg-[#FCFEFD]" dir="rtl">
      <div className="flex">
        <DoctorSidebar />
        <main className="flex-1 px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;