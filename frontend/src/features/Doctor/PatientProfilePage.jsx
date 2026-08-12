import { useEffect, useState } from "react";
import {
  Calendar,
  Globe,
  User,
  Trash2,
  Pencil,
  Phone,
  Mail,
  FileText,
  Plus,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import patientService from "../../services/patient.service";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
const { user } = useAuth();
const basePath = location.pathname.startsWith("/admin")
  ? "/admin"
  : location.pathname.startsWith("/team-leader")
  ? "/team-leader"
  : "/doctor";
  const { patientId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [patient, setPatient] = useState(null);
  
  // Unified state for both pre and post reports
  const [allReports, setAllReports] = useState([]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [patientId]);
  
  const loadPatient = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch from the new updated backend endpoint
      const response = await patientService.getPatientById(patientId);
      
      // Extract the new 3-part data structure from the response
      const { patient, preReports, postReports } = response.data;
      
      setPatient(patient); 

      // Format Pre-Reports
      const formattedPreReports = (preReports || []).map(r => ({
        ...r,
        reportType: "قبلي", // Pre
        programName: r.reportInformation?.programName,
        viewLink: `${basePath}/pre-reports/${r._id}`
      }));

      // Format Post-Reports
      const formattedPostReports = (postReports || []).map(r => ({
        ...r,
        reportType: "بعدي", // Post
        programName: r.beneficiaryInformation?.programName,
        viewLink: `${basePath}/post-reports/${r._id}`
      }));

      // Combine both arrays and sort chronologically (newest first)
      const combined = [...formattedPreReports, ...formattedPostReports].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAllReports(combined);

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load patient data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    // 1. SweetAlert Confirmation
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استرجاع بيانات هذا المستفيد بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#35C759",
      confirmButtonText: "نعم، احذف المستفيد",
      cancelButtonText: "إلغاء",
      customClass: { popup: "font-['Cairo']" },
    });

    if (result.isConfirmed) {
      try {
        await patientService.deletePatient(patientId);
        
        // 2. SweetAlert Success
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف بيانات المستفيد بنجاح.",
          icon: "success",
          confirmButtonColor: "#35C759",
          confirmButtonText: "حسناً",
          customClass: { popup: "font-['Cairo']" },
        });
        
        navigate(-1);
      } catch (err) {
        // 3. SweetAlert Error
        Swal.fire({
          title: "خطأ!",
          text: err.response?.data?.message || "حدث خطأ أثناء محاولة حذف المستفيد.",
          icon: "error",
          confirmButtonColor: "#35C759",
          confirmButtonText: "حسناً",
          customClass: { popup: "font-['Cairo']" },
        });
      }
    }
  };



  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFEFD]">
        <div className="flex flex-col items-center gap-4 text-[#247C5A]">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-lg font-semibold">
            جاري تحميل بيانات المستفيد...
          </p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCFEFD]">

        <p className="mb-6 text-xl font-semibold text-red-600">
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/doctor/patients")
          }
          className="rounded-xl bg-[#35C759] px-6 py-3 font-semibold text-white"
        >
          العودة للمستفيدين
        </button>

      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FCFEFD] px-10 py-10"
    >
      <div className="mx-auto max-w-[1500px]">
<BackButton showHome />
        {/* Breadcrumb */}

      

        {/* Header */}

        <div className="mb-12 flex items-start justify-between">

          <div>

            <h1 className="text-5xl font-bold text-[#111827]">
              ملف المستفيد
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              البيانات الكاملة الخاصة بالمستفيد
            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={() =>
                navigate(
                  `/doctor/edit-patient/${patient._id}`
                )
              }
              className="flex items-center gap-2 rounded-xl bg-[#35C759] px-7 py-4 font-semibold text-white transition hover:bg-[#2FB350]"
            >
              <Pencil size={18} />
              تعديل المعلومات
            </button>

            

          </div>

        </div>

        {/* ====================== */}
        {/* Personal Information */}
        {/* ====================== */}

        <section className="mb-16">

          <div className="mb-8 flex items-center gap-3">

            <div className="rounded-xl bg-[#EAF8F1] p-3">
              <User
                size={24}
                className="text-[#247C5A]"
              />
            </div>

            <h2 className="text-3xl font-bold">
              المعلومات الشخصية
            </h2>

          </div>

          <div className="grid grid-cols-3 gap-6">

            <div>

              <label className="mb-2 block font-medium">
                الاسم الأول
              </label>

              <input
                readOnly
                value={patient.firstName || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                الاسم الثاني
              </label>

              <input
                readOnly
                value={patient.middleName || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                اسم العائلة
              </label>

              <input
                readOnly
                value={patient.lastName || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                رقم الهوية
              </label>

              <input
                readOnly
                value={patient.nationalId || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                الجنس
              </label>

              <input
                readOnly
                value={
                  patient.gender === "male"
                    ? "ذكر"
                    : "أنثى"
                }
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                الجنسية
              </label>

              <div className="relative">

                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  readOnly
                  value={patient.nationality || ""}
                  className="h-14 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                تاريخ الميلاد
              </label>

              <div className="relative">

                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  readOnly
                  value={
                    patient.dateOfBirth
                      ? new Date(
                          patient.dateOfBirth
                        ).toLocaleDateString("en-CA")
                      : ""
                  }
                  className="h-14 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                المهنة
              </label>

              <input
                readOnly
                value={patient.occupation || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                الحالة الاجتماعية
              </label>

              <input
                readOnly
                value={patient.maritalStatus || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

          </div>

        </section>        {/* ====================== */}
        {/* Contact Information */}
        {/* ====================== */}

        <section className="mb-16">

          <div className="mb-8 flex items-center gap-3">

            <div className="rounded-xl bg-[#EAF8F1] p-3">
              <Phone
                size={24}
                className="text-[#247C5A]"
              />
            </div>

            <h2 className="text-3xl font-bold">
              معلومات التواصل
            </h2>

          </div>

          <div className="grid grid-cols-3 gap-6">

            <div>

              <label className="mb-2 block font-medium">
                رقم الهاتف
              </label>

              <input
                readOnly
                value={patient.phone || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                رقم هاتف بديل
              </label>

              <input
                readOnly
                value={patient.alternativePhone || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                رقم هاتف الطوارئ
              </label>

              <input
                readOnly
                value={
                  patient.emergencyContactPhone || ""
                }
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                صلة القرابة
              </label>

              <input
                readOnly
                value={
                  patient.emergencyContactRelation ||
                  ""
                }
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

            <div className="col-span-2">

              <label className="mb-2 block font-medium">
                البريد الإلكتروني
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  readOnly
                  value={patient.email || ""}
                  className="h-14 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4"
                />

              </div>

            </div>

            <div className="col-span-3">

              <label className="mb-2 block font-medium">
                العنوان
              </label>

              <input
                readOnly
                value={patient.address || ""}
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4"
              />

            </div>

          </div>

        </section>

       {/* ====================== */}
        {/* Reports */}
        {/* ====================== */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EAF8F1] p-3">
                <FileText
                  size={24}
                  className="text-[#247C5A]"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">التقارير السابقة</h2>
                <p className="mt-1 text-gray-500">سجل التقارير القبلية والبعدية</p>
              </div>
            </div>
            {user?.role === "doctor" && (
  <button
    onClick={() => setIsReportModalOpen(true)}
    className="flex items-center gap-2 rounded-xl bg-[#35C759] px-6 py-3 font-semibold text-white transition hover:bg-[#2FB350]"
  >
    <Plus size={18} /> إضافة تقرير
  </button>
)}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-right">
                  <th className="px-8 py-5">نوع التقرير</th>
                  <th className="px-8 py-5">اسم البرنامج</th>
                  <th className="px-8 py-5">رئيس الفريق</th>
                  <th className="px-8 py-5">الحالة</th>
                  <th className="px-8 py-5">التاريخ</th>
                  <th className="px-8 py-5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {allReports.length > 0 ? (
                  allReports.map((report) => (
                    <tr key={report._id} className="border-t">
                      <td className="px-8 py-6 font-bold text-[#1E7A5A]">
                        {report.reportType}
                      </td>
                      <td className="px-8 py-6">
                        {report.programName || "-"}
                      </td>
                      <td className="px-8 py-6">
                        {report.teamLeader
                          ? `${report.teamLeader.firstName} ${report.teamLeader.lastName}`
                          : "-"}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            report.approval?.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : report.approval?.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {report.approval?.status === "approved"
                            ? "معتمد"
                            : report.approval?.status === "rejected"
                            ? "مرفوض"
                            : "قيد الانتظار"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {new Date(report.createdAt).toLocaleDateString("en-CA")}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => navigate(report.viewLink)}
                            className="rounded-lg bg-[#EDF8F2] p-2 transition hover:bg-[#DDF4E5]"
                          >
                            <Eye size={18} className="text-[#247C5A]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      لا توجد تقارير سابقة لهذا المستفيد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
              {/* ====================== */}
      {/* Report Type Modal */}
      {/* ====================== */}

      {isReportModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="relative w-full max-w-xl rounded-3xl bg-white p-10 shadow-2xl">

            {/* Close */}

            <button
              onClick={() =>
                setIsReportModalOpen(false)
              }
              className="absolute left-5 top-5 rounded-full p-2 text-gray-400 transition hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <h2 className="mb-3 text-center text-3xl font-bold text-[#111827]">
              إضافة تقرير جديد
            </h2>

            <p className="mb-10 text-center text-gray-500">
              اختر نوع التقرير الذي تريد إضافته
            </p>

            <div className="grid grid-cols-2 gap-6">

              {/* Pre Report */}
<button
  onClick={() => {
    setIsReportModalOpen(false);

    navigate(
      `${basePath}/reports/beneficiary/${patient._id}`
    );
  }}
  className="
    flex
    h-40
    flex-col
    items-center
    justify-center
    rounded-2xl
    border
    border-[#35C759]
    bg-[#EDF8F2]
    transition
    hover:scale-105
  "
>
  <FileText
    size={40}
    className="mb-4 text-[#247C5A]"
  />

  <span className="text-xl font-bold text-[#247C5A]">
    التقرير القبلي
  </span>
</button>

              {/* Post Report */}

              <button
                onClick={() => {
                  setIsReportModalOpen(false);

                  navigate(
                    `${basePath}/reports/secondary/${patient._id}`
                  );
                }}
                className="
                  flex
                  h-40
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#35C759]
                  bg-[#EDF8F2]
                  transition
                  hover:scale-105
                "
              >

                <FileText
                  size={40}
                  className="mb-4 text-[#247C5A]"
                />

                <span className="text-xl font-bold text-[#247C5A]">
                  التقرير البعدي
                </span>

              </button>

            </div>

          </div>

        </div>

      )}

      </div>
    </main>
  );
};

export default PatientProfilePage;