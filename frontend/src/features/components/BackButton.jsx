import { useNavigate } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";

const BackButton = ({ label = "العودة للخلف", showHome = false, to, className = "" }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (showHome) {
      // If showHome is true, determine where "Home" is based on the user's role
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "teamLeader") navigate("/team-leader");
      else if (user.role === "doctor") navigate("/doctor");
      else navigate("/");
    } else if (to) {
      // If a specific path is provided, go there
      navigate(to);
    } else {
      // Default: Go back to the previous page in browser history
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleNavigation}
      className={`mb-6 flex w-fit items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-600 shadow-sm transition-all hover:-translate-x-1 hover:bg-[#A9D3DF] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#35C759]/20 active:scale-95 ${className}`}
      dir="rtl"
    >
      {showHome ? <Home size={18} /> : <ArrowRight size={18} />}
      <span>{showHome ? "العودة للرئيسية" : label}</span>
    </button>
  );
};

export default BackButton;