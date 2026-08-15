import { Download, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PageHeader = ({
  title,
  description,
  downloadText,
  onDownload,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the correct base path prefix based on the current active role/layout
  const basePath = location.pathname.startsWith("/admin")
    ? "/admin"
    : location.pathname.startsWith("/team-leader")
    ? "/team-leader"
    : "/doctor";

  // Check if we are currently on a profile page or patient profile page to hide the icon
  const isProfilePage = location.pathname.includes("/profile");
  const isPatientProfilePage = location.pathname.includes("/patient/");

  const showProfileIcon = !isProfilePage && !isPatientProfilePage;

  return (
    <section className="mb-10">

      {/* TOPMOST BAR: Profile Icon on the absolute top-left */}
      <div className="flex justify-end mb-4">
        {showProfileIcon && (
          <button
            onClick={() => navigate(`${basePath}/profile`)}
            title="الملف الشخصي"
            className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#6AB7B9] shadow-sm transition hover:bg-[#6AB7B9]/10"
          >
            <User size={24} />
          </button>
        )}
      </div>

      {/* Breadcrumb */}

      <div className="mb-16 mt-8 flex justify-center text-lg">
        <span className="font-semibold text-[#1E1E1E]">
          الرئيسية
        </span>

        <span className="mx-3 text-[#50A0B8]">{">"}</span>

        <span className="text-gray-500">
          {title}
        </span>
      </div>

      {/* Title */}

      <div dir="ltr" className="flex items-end justify-between">

        {/* Download Button */}

        <div>
          {onDownload && downloadText && (
            <button
              onClick={onDownload}
              className="
                flex
                h-12
                items-center
                gap-2
                rounded-xl
                bg-[#6AB7B9]
                px-6
                text-white
                transition
                hover:opacity-90
              "
            >
              <Download size={18} />
              {downloadText}
            </button>
          )}
        </div>

        {/* Title */}

        <div className="text-right">
          <h1 className="text-[44px] font-bold text-[#202020]">
            {title}
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            {description}
          </p>
        </div>

      </div>

      {/* Divider */}

      <div className="mt-8 h-px bg-[#98cacb]" />

    </section>
  );
};

export default PageHeader;