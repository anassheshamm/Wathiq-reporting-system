import { Outlet } from "react-router-dom";
import TeamLeaderSidebar from "./TeamLeaderSidebar";

const TeamLeaderLayout = () => {
  return (
    <div className="min-h-screen bg-[#FCFEFD]" dir="rtl">
      <div className="flex">
        <TeamLeaderSidebar />
        <main className="flex-1 px-10 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeamLeaderLayout;