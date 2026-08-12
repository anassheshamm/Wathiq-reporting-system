import { useEffect, useState } from "react";
import { Plus, Search, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext"; // 1. Import Search Context
import { useNavigate } from "react-router-dom";

import patientService from "../../services/patient.service";

const DoctorSidebar = () => {
  // 2. Pull global search state and updater
  const { searchTerm, setSearchTerm } = useSearch();

  const [statistics, setStatistics] = useState({
    patients: 0,
    reports: 0,
    pendingReports: 0,
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const loadStatistics = async () => {
    try {
      const patientsResponse = await patientService.getAllPatients();
      const patients = patientsResponse.data || [];

      setStatistics({
        patients: patients.length,
      });
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  return (
    <aside
      dir="rtl"
      className="sticky top-0 h-screen w-[320px] shrink-0 border-l border-[#E6F2EC] bg-[#F7FFF9] px-6 py-8 shadow-sm"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img
            src="/logo2.png"
            alt="Recovery"
            className="w-36 object-contain"
          />
           <img
            src="/logo.png"
            alt="Recovery"
            className="w-36 object-contain"
          />
        </div>

        {/* Create Patient */}
        <Link
          to="/doctor/new"
          className="mb-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#35C759] text-lg font-semibold text-white transition-all duration-200 hover:bg-[#2FB350] active:scale-[0.98]"
        >
          <Plus size={22} />
          <span>إنشاء ملف مستفيد جديد</span>
        </Link>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={20}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm} // 3. Bound directly to global context search term
            onChange={(e) => setSearchTerm(e.target.value)} // 4. Updates global context instantly on keystroke
            placeholder="ابحث بالاسم أو رقم الهوية"
            className="h-14 w-full rounded-2xl bg-[#EDF8F2] pl-4 pr-14 text-right outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#247C5A]/10"
          />
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-base">
            <span>عدد المستفيدين</span>
            <span className="font-bold text-[#247C5A]">
              {statistics.patients}
            </span>
          </div>
        </div>

        <div className="flex-1" />
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

export default DoctorSidebar;