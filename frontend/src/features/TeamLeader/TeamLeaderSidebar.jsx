import { useEffect, useState } from "react";
import { ClipboardList, Users, UserRound, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import reportService from "../../services/report.service";
import userService from "../../services/user.service";
import patientService from "../../services/patient.service";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TeamLeaderSidebar = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    allReports: 0,
    pendingReports: 0,
    patients: 0,
  });
  
  const { logout } = useAuth();
  const navigate = useNavigate();
 const handleLogout = () => {
  logout();
  navigate("/", { replace: true });
};
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [preRes, postRes, teamRes, patientsRes] = await Promise.all([
          reportService.getPendingPreReports(),
          reportService.getPendingPostReports(),
          userService.getMyTeam(),
          patientService.getPatients(), // We updated backend to filter this automatically!
        ]);
        
        const pendingCount = (preRes.data?.data?.length || 0) + (postRes.data?.data?.length || 0);
      
      
   
        setStats({
          doctors: teamRes.data?.data?.length || 0,
          patients: patientsRes.data?.data?.length || 0,
          pendingReports: pendingCount,
          allReports: pendingCount, 
        });
      } catch (err) {
        console.error("Failed to load team leader stats", err);
      }
    };
    loadStats();
  }, []);

  return (
    <aside dir="rtl" className="sticky top-0 h-screen w-[320px] shrink-0 border-l border-[#E6F2EC] bg-[#E4EFF3] px-6 py-8 shadow-sm">
      <div className="flex h-full flex-col">
        <div className="mb-10 flex justify-center">
          <img src="/logo2.png" alt="Recovery" className="w-36 object-contain" />
            <img src="/logo.png" alt="Recovery" className="w-36 object-contain" />
        </div>

        <nav className="mb-8 space-y-3">
          <NavLink
            to="/team-leader"
            end
            className={({ isActive }) => `flex h-14 w-full items-center gap-3 rounded-2xl px-5 text-lg font-semibold transition-all duration-200 ${isActive ? "bg-[#4FA0B7] text-white" : "text-[#2F2F2F] hover:bg-[#22758d]"}`}
          >
            <ClipboardList size={22} />
            <span>التقارير المعلقة</span>
          </NavLink>
          <NavLink
            to="/team-leader/doctors"
            className={({ isActive }) => `flex h-14 w-full items-center gap-3 rounded-2xl px-5 text-lg font-semibold transition-all duration-200 ${isActive ? "bg-[#4FA0B7] text-white" : "text-[#2F2F2F] hover:bg-[#22758d]"}`}
          >
            <Users size={22} />
            <span>أطباء الفريق</span>
          </NavLink>
          <NavLink
            to="/team-leader/patients"
            className={({ isActive }) => `flex h-14 w-full items-center gap-3 rounded-2xl px-5 text-lg font-semibold transition-all duration-200 ${isActive ? "bg-[#4FA0B7] text-white" : "text-[#2F2F2F] hover:bg-[#22758d]"}`}
          >
            <UserRound size={22} />
            <span>مستفيدي الفريق</span>
          </NavLink>
        </nav>

        <div className="rounded-[28px] border border-[#E8F2EC] bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-[#22758d]">إحصائيات الفريق</h3>
          <div className="space-y-5 text-base text-gray-600">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span>أعضاء الفريق</span>
              <span className="font-bold text-[#22758d]">{stats.doctors}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span>مستفيدي الفريق</span>
              <span className="font-bold text-[#22758d]">{stats.patients}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>طلبات قيد الانتظار</span>
              <span className="rounded-full bg-yellow-100 px-3 py-1 font-bold text-yellow-700">{stats.pendingReports}</span>
            </div>
          </div>
        </div>
         <button
  onClick={handleLogout}
  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
>
  <LogOut size={18} />
  تسجيل الخروج
</button>
      </div>
    </aside>
  );
};

export default TeamLeaderSidebar;