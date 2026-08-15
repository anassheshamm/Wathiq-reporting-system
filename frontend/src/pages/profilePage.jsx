import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import BackButton from "../features/components/BackButton";
import userService from "../services/user.service";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Profile State (Read-only view)
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    // nationality: "",
    jobTitle: "",
    phoneNumber: "",
    nationalId: "",
    email: "",
    // groupSupervisor: "",
  });

  // Fetch current user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        const userData = response.data?.data || response.data || response;
        
        setProfile({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
        //   nationality: userData.nationality || "",
          jobTitle: userData.jobTitle || "",
          phoneNumber: userData.phoneNumber || userData.phone || "",
          nationalId: userData.nationalId || "",
          email: userData.email || "",
        //   groupSupervisor: userData.groupSupervisor || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        Swal.fire({
          title: "خطأ",
          text: error?.response?.data?.message || "فشل في تحميل بيانات الملف الشخصي",
          icon: "error",
          confirmButtonColor: "#35C759",
          confirmButtonText: "حسناً",
          customClass: { popup: "font-['Cairo']" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFEFD] font-['Cairo']">
        <div className="flex flex-col items-center gap-4 text-[#4FA0B7]">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-lg font-semibold">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FCFEFD] px-10 py-10 font-['Cairo',sans-serif] text-[15px] leading-[1.9] text-[#27343A]"
    >
      <div className="mx-auto max-w-[1500px]">
        <BackButton showHome />

        {/* ================= HEADER ================= */}
        <div className="mb-12 mt-6 flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold text-[#111827]">
              الملف الشخصي
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              البيانات التعريفية ومعلومات الحساب الشخصية 
            </p>
          </div>
        </div>

        {/* ================= PERSONAL INFORMATION ================= */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-[#4FA0B7]/30 p-3">
              <span className="text-xl font-bold text-[#4FA0B7]">01</span>
            </div>
            <h2 className="text-3xl font-bold text-[#111827]">
              التعريف الشخصي
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* First Name */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">الاسم الأول</label>
              <input
                type="text"
                readOnly
                value={profile.firstName}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">اسم العائلة</label>
              <input
                type="text"
                readOnly
                value={profile.lastName}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div>
              {/* National ID */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">رقم الهوية</label>
              <input
                type="text"
                readOnly
                value={profile.nationalId}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div>

            {/* Nationality
            <div>
              <label className="mb-2 block font-medium text-gray-700">الجنسية</label>
              <input
                type="text"
                readOnly
                value={profile.nationality}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div> */}

            {/* Job Title */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">المسمى الوظيفي</label>
              <input
                type="text"
                readOnly
                value={profile.jobTitle}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div>

          </div>
        </section>

        {/* ================= CONTACT & ACCOUNT DETAILS ================= */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-[#4FA0B7]/30 p-3">
              <span className="text-xl font-bold text-[#4FA0B7]">02</span>
            </div>
            <h2 className="text-3xl font-bold text-[#111827]">
              معلومات التواصل وبيانات الحساب
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Phone Number */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">رقم الهاتف</label>
              <input
                type="text"
                readOnly
                value={profile.phoneNumber}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div>

          

            {/* Email */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">البريد الإلكتروني</label>
              <input
                type="email"
                readOnly
                value={profile.email}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div>

            {/* Group Supervisor */}
            {/* <div>
              <label className="mb-2 block font-medium text-gray-700">مشرف مجموعة</label>
              <input
                type="text"
                readOnly
                value={profile.groupSupervisor}
                className="h-14 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 outline-none"
              />
            </div> */}

          </div>
        </section>

      </div>
    </main>
  );
};

export default ProfilePage;