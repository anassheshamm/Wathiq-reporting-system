import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

const menu = [
  {
    label: "رئيس القسم",
    path: "/admin/heads",
  },
  {
    label: "المعالجين",
    path: "/admin/doctors",
  },
  {
    label: "المستفيدين",
    path: "/admin/patients",
  },
];

const AdminLayout = () => {
  return (
    <div dir="ltr" className="min-h-screen bg-[#FCFEFD]">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 px-10 py-8">
          <Outlet />
        </main>

        {/* Sidebar - Added print:hidden here */}
        <div className="print:hidden">
          <Sidebar menu={menu} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;