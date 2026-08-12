import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useSearch } from "../../../context/SearchContext"; // 1. Import SearchContext
import InviteMemberModal from "../InviteMemberModal";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ menu = [] }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // 2. Use global search state instead of local state!
  const { searchTerm, setSearchTerm } = useSearch(); 
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleMemberAdded = () => {
    setIsInviteModalOpen(false);
  };

  return (
    <>
      <aside
        dir="rtl"
        className="sticky top-0 h-screen w-[320px] shrink-0 border-l border-[#E6F2EC] bg-[#F7FFF9] px-6 py-8 shadow-sm"
      >
        <div className="flex h-full flex-col">
          
          {/* ================= Logos ================= */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            <img
              src="/logo.png"
              alt="Recovery Logo 1"
              className="w-24 object-contain"
            />
            <img
              src="/logo2.png"
              alt="Recovery Logo 2"
              className="w-24 object-contain"
            />
          </div>

          {/* ================= Invite Member ================= */}
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="mb-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#35C759] text-lg font-semibold text-white transition-all duration-200 hover:bg-[#2FB350] active:scale-[0.98]"
          >
            <Plus size={22} />
            <span>إضافة عضو جديد</span>
          </button>

          {/* ================= Search ================= */}
          <div className="relative mb-8">
            <Search
              size={20}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm} // 3. Bind to Context
              onChange={(e) => setSearchTerm(e.target.value)} // 4. Update Context directly
              placeholder="ابحث بالاسم أو رقم الهوية للمستفيد"
              className="h-14 w-full rounded-2xl bg-[#EDF8F2] pr-14 pl-4 text-right text-base outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-[#247C5A]/10"
            />
          </div>

          {/* ================= Navigation ================= */}
          <nav className="space-y-4">
            {menu.map((item) => (
              <SidebarItem key={item.path || item.label} item={item} />
            ))}
          </nav>

          {/* Spacer to push everything below to the bottom */}
          <div className="flex-1" />

          {/* ================= Logout ================= */}
          <button
            onClick={handleLogout}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-red-100 bg-white text-red-600 transition-all hover:border-red-200 hover:bg-red-50 active:scale-[0.98]"
          >
            <LogOut size={20} />
            <span className="font-semibold">تسجيل الخروج</span>
          </button>

          {/* ================= Footer ================= */}
          <div className="pt-6 text-center text-sm text-gray-400">
            Recovery System © 2026
          </div>
        </div>
      </aside>

      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={handleMemberAdded}
      />
    </>
  );
};

export default Sidebar;