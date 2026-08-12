import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Printer, CheckCircle, XCircle } from "lucide-react";
import api from "../../services/api";
import reportService from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../components/BackButton";
import Swal from "sweetalert2";

const PostReportPreview = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/post-reports/${reportId}`);
        setReport(response.data.data || response.data);
      } catch (err) {
        setError("فشل في تحميل تفاصيل التقرير البعدي.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "تأكيد الاعتماد",
      text: "هل أنت متأكد من رغبتك في اعتماد هذا التقرير؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34C759",
      cancelButtonColor: "#888",
      confirmButtonText: "نعم، اعتمده",
      cancelButtonText: "إلغاء",
      customClass: { popup: "font-['Cairo']" },
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(true);
      await reportService.approvePostReport(reportId);
      
      await Swal.fire({
        title: "تم بنجاح",
        text: "تم اعتماد التقرير بنجاح",
        icon: "success",
        confirmButtonColor: "#34C759",
        customClass: { popup: "font-['Cairo']" },
      });

      navigate("/team-leader");
    } catch (err) {
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء الاعتماد.",
        icon: "error",
        confirmButtonColor: "#34C759",
        customClass: { popup: "font-['Cairo']" },
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "سبب الرفض",
      input: "textarea",
      inputLabel: "يرجى إدخال سبب الرفض:",
      inputPlaceholder: "اكتب السبب هنا...",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#888",
      confirmButtonText: "تأكيد الرفض",
      cancelButtonText: "إلغاء",
      customClass: { popup: "font-['Cairo']" },
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "يجب إدخال سبب الرفض!";
        }
      },
    });

    if (!isConfirmed || !reason) return;

    try {
      setProcessing(true);
      await reportService.rejectPostReport(reportId, reason);
      
      await Swal.fire({
        title: "تم الرفض",
        text: "تم رفض التقرير بنجاح",
        icon: "success",
        confirmButtonColor: "#34C759",
        customClass: { popup: "font-['Cairo']" },
      });

      navigate("/team-leader");
    } catch (err) {
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء الرفض.",
        icon: "error",
        confirmButtonColor: "#34C759",
        customClass: { popup: "font-['Cairo']" },
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#35C759]" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mt-20 text-center text-xl font-semibold text-red-600">
        {error}
      </div>
    );
  }

  // ==========================================
  // Translation Dictionaries 
  // ==========================================
  const translateSeverity = (val) => ({ mild: "خفيفة", moderate: "متوسطة", severe: "شديدة" }[val] || val);
  const translatePsychological = (val) => ({ significant_improvement: "تحسن ملحوظ", moderate_improvement: "تحسن متوسط", no_improvement: "لا يوجد تحسن" }[val] || val);
  const translateBehavioral = (val) => ({ high_commitment: "التزام عالي", medium_commitment: "التزام متوسط", difficulty_commitment: "صعوبة في الالتزام" }[val] || val);
  const translateSocial = (val) => ({ positive_interaction: "تفاعل إيجابي", limited_interaction: "تفاعل محدود", social_isolation: "عزلة اجتماعية" }[val] || val);
  const translateOverall = (val) => ({ excellent: "ملحوظ جداً", good: "جيد", limited: "محدود" }[val] || val);
  const translateTreatment = (val) => ({ fully_committed: "ملتزم تماماً", partially_committed: "ملتزم جزئياً", not_committed: "غير ملتزم" }[val] || val);
  const translateActivity = (val) => ({ active: "نشط", average: "متوسط", weak: "ضعيف" }[val] || val);
  const translateEmotional = (val) => ({ stable: "مستقرة", fluctuating: "متقلبة", disturbed: "مضطربة" }[val] || val);
  const translateFamily = (val) => ({ improved: "تحسنت", unchanged: "لا تتغير", still_tense: "لا تزال متوترة" }[val] || val);
  const translateCommunity = (val) => ({ ready: "جاهز", needs_support: "يحتاج دعم إضافي", not_ready: "غير مستعد حالياً" }[val] || val);
  const translateStability = (val) => ({ very_good: "جيد جداً", acceptable: "مقبول", weak: "ضعيف" }[val] || val);
  const translateReadiness = (val) => ({ ready: "جاهز", under_development: "قيد التطوير", not_ready: "غير مستعد" }[val] || val);
  const translateStatus = (status) => ({ pending: "قيد الانتظار", approved: "معتمد", rejected: "مرفوض" }[status] || status);

  const patientFullName = report.patient ? `${report.patient.firstName || ""} ${report.patient.middleName || ""} ${report.patient.lastName || ""}` : "غير متوفر";
  const teamLeaderFullName = report.teamLeader ? `${report.teamLeader.firstName || ""} ${report.teamLeader.lastName || ""}` : "غير متوفر";

  return (
    <div dir="rtl" className="min-h-screen font-['Cairo',sans-serif] text-[15px] leading-[1.9] text-[#27343A] print:bg-white print:bg-none">
      
     

      <div className="mx-auto my-10 w-full max-w-[1100px] px-5 md:px-10 print:my-0 print:px-0 print:max-w-none">
        
        {/* Header Actions (Hidden during print) */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <ArrowRight size={20} />
            رجوع
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-[#34C759] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#2FB350]">
            <Printer size={20} />
            طباعة التقرير
          </button>
        </div>

        {/* ================= LETTERHEAD ================= */}
        <header className="mb-8 rounded-[28px] border border-[#E7F0EB] bg-white/95 p-[28px] shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-none print:shadow-none print:p-0">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-12 print:mb-4">
            <img src="/logo.png" alt="Logo" className="h-16 object-contain" />
            <img src="/logo2.png" alt="Logo" className="h-16 object-contain" />
          </div>
          <div className="my-6 h-[2px] w-full bg-gradient-to-r from-transparent via-[#34C759] to-transparent print:bg-[#34C759]" />
          <div className="flex flex-col justify-between gap-6 md:flex-row print:flex-row print:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#1E7A5A]">التقرير الخاص بالمستفيد</h1>
              <p className="mt-2 text-gray-500">تقرير متابعة وتقييم المتعافي</p>
            </div>
            <div className="rounded-full bg-[#EAF5F0] border border-[#1E7A5A]/10 px-8 py-3 font-bold text-[#1E7A5A]">
              بعدي (نسخة معاينة)
            </div>
          </div>
        </header>

        {/* ================= REJECTION ALERT ================= */}
        {report.approval?.status === "rejected" && (
          <div className="mb-10 rounded-[22px] border-2 border-red-200 bg-red-50 p-8 shadow-sm print:break-inside-avoid">
            <div className="flex items-center gap-3 text-red-700 mb-3">
              <XCircle size={28} />
              <h2 className="text-2xl font-bold">تم رفض هذا التقرير</h2>
            </div>
            <p className="text-lg text-red-800">
              <span className="font-bold">سبب الرفض: </span>
              {report.approval?.rejectionReason || "لم يقم رئيس الفريق بكتابة سبب الرفض."}
            </p>
          </div>
        )}

        {/* ================= 1. PATIENT INFO ================= */}
        <section className="mt-8 print:mt-4">
          <div className="mb-6 flex items-center gap-4 print:mb-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">1</span>
            <h2 className="text-2xl font-bold text-[#1E7A5A]">بيانات المستفيد</h2>
          </div>
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#1E7A5A]">اسم المستفيد</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium print:bg-white print:border-b">{patientFullName}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#1E7A5A]">اسم البرنامج</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium print:bg-white print:border-b">{report.beneficiaryInformation?.programName || "-"}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#1E7A5A]">تاريخ البدء</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium print:bg-white print:border-b">
                  {report.beneficiaryInformation?.startDate ? new Date(report.beneficiaryInformation.startDate).toLocaleDateString("en-CA") : "-"}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#1E7A5A]">تاريخ التخرج</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium print:bg-white print:border-b">
                  {report.beneficiaryInformation?.graduationDate ? new Date(report.beneficiaryInformation.graduationDate).toLocaleDateString("en-CA") : "-"}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#1E7A5A]">رقم الهوية</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium print:bg-white print:border-b">{report.patient?.nationalId || "-"}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#1E7A5A]">اسم المرشد</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium print:bg-white print:border-b">{report.beneficiaryInformation?.counselorName || "-"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. CASE SUMMARY ================= */}
        <section className="mt-12 print:mt-6 print:break-inside-avoid">
          <div className="mb-6 flex items-center gap-4 print:mb-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">2</span>
            <h2 className="text-2xl font-bold text-[#1E7A5A]">ملخص الحالة المتعلق بتعديل الوضع</h2>
          </div>
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-[#1E7A5A]">ملخص الحالة</span>
              <div className="min-h-[120px] w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium leading-relaxed print:bg-white print:border-none print:px-0">
                {report.caseSummary?.summary || "-"}
              </div>
            </div>
            <div className="my-8 h-[1px] w-full bg-[#E7F0EB] print:my-4"></div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[#1E7A5A]">شدة الإدمان:</span>
              <div className="rounded-xl bg-[#F8FCFA] border border-[#E7F0EB] px-6 py-2 font-bold text-[#1E7A5A] print:bg-white">
                {translateSeverity(report.caseSummary?.addictionSeverity)}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. PROGRESS ASSESSMENT ================= */}
        <section className="mt-12 print:mt-6 print:break-inside-avoid">
          <div className="mb-6 flex items-center gap-4 print:mb-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">3</span>
            <h2 className="text-2xl font-bold text-[#1E7A5A]">قياس التقدم في الجوانب التالية</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-300 print:shadow-none print:p-4">
              <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#1E7A5A] print:mb-3 print:pb-2">الجانب النفسي</h3>
              <div className="rounded-xl border border-[#34C759] bg-[#F5FCF7] px-4 py-4 text-center font-bold text-[#1E7A5A] print:bg-white print:border-gray-300">
                {translatePsychological(report.progressAssessment?.psychologicalStatus)}
              </div>
            </div>
            <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-300 print:shadow-none print:p-4">
              <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#1E7A5A] print:mb-3 print:pb-2">الجانب السلوكي</h3>
              <div className="rounded-xl border border-[#34C759] bg-[#F5FCF7] px-4 py-4 text-center font-bold text-[#1E7A5A] print:bg-white print:border-gray-300">
                {translateBehavioral(report.progressAssessment?.behavioralStatus)}
              </div>
            </div>
            <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-300 print:shadow-none print:p-4">
              <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#1E7A5A] print:mb-3 print:pb-2">الجانب الاجتماعي</h3>
              <div className="rounded-xl border border-[#34C759] bg-[#F5FCF7] px-4 py-4 text-center font-bold text-[#1E7A5A] print:bg-white print:border-gray-300">
                {translateSocial(report.progressAssessment?.socialStatus)}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. PROGRAM PROGRESS ================= */}
        <section className="mt-12 print:mt-6 print:break-inside-avoid">
          <div className="mb-6 flex items-center gap-4 print:mb-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">4</span>
            <h2 className="text-2xl font-bold text-[#1E7A5A]">مدى تقدم المتعافي في البرنامج</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              { title: "التحسن العام", val: translateOverall(report.programProgress?.overallImprovement) },
              { title: "الالتزام بالخطة العلاجية", val: translateTreatment(report.programProgress?.treatmentCommitment) },
              { title: "المشاركة في الأنشطة", val: translateActivity(report.programProgress?.activityParticipation) },
              { title: "الحالة النفسية والعاطفية", val: translateEmotional(report.programProgress?.emotionalStability) },
              { title: "العلاقة مع الأسرة", val: translateFamily(report.programProgress?.familyRelationship) },
              { title: "الاستعداد للاندماج بالمجتمع", val: translateCommunity(report.programProgress?.communityReadiness) },
            ].map((item, idx) => (
              <div key={idx} className="rounded-[20px] border border-[#E7F0EB] bg-white p-6 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-300 print:shadow-none print:p-4">
                <span className="text-gray-500 font-semibold mb-2 block print:mb-1">{item.title}</span>
                <div className="text-lg font-bold text-[#1E7A5A]">{item.val || "-"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 5 & 6. STABILITY AND FUTURE ================= */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 print:mt-6 print:break-inside-avoid">
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
             <div className="mb-4 flex items-center gap-3 print:mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">5</span>
              <h3 className="text-xl font-bold text-[#1E7A5A]">الاستقرار بدون انتكاسة</h3>
            </div>
            <div className="rounded-xl bg-[#F8FCFA] border border-[#E7F0EB] px-6 py-4 font-bold text-[#1E7A5A] text-center print:bg-white print:border-gray-300">
              {translateStability(report.recoveryStability)}
            </div>
          </div>

          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
             <div className="mb-4 flex items-center gap-3 print:mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">6</span>
              <h3 className="text-xl font-bold text-[#1E7A5A]">خطة ما بعد البرنامج</h3>
            </div>
            <div className="rounded-xl bg-[#F8FCFA] border border-[#E7F0EB] px-6 py-4 font-bold text-[#1E7A5A] text-center print:bg-white print:border-gray-300">
              {translateReadiness(report.personalPlanReadiness)}
            </div>
          </div>
        </section>

        {/* ================= 7, 8, 9. NOTES AND RECOMMENDATIONS ================= */}
        <section className="mt-12 grid grid-cols-1 gap-6 print:mt-6 print:break-inside-avoid">
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
            <div className="mb-4 flex items-center gap-3 print:mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">7</span>
              <h3 className="text-xl font-bold text-[#1E7A5A]">إشعار الأسرة والعمل خلال فترة التعافي</h3>
            </div>
            <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium leading-relaxed min-h-[100px] print:bg-white print:border-none print:px-0">
              {report.familyNotification?.notes || "لا توجد ملاحظات"}
            </div>
          </div>
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
            <div className="mb-4 flex items-center gap-3 print:mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">8</span>
              <h3 className="text-xl font-bold text-[#1E7A5A]">توصيات المرشد</h3>
            </div>
            <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium leading-relaxed min-h-[100px] print:bg-white print:border-none print:px-0">
              {report.recommendations || "لا توجد توصيات"}
            </div>
          </div>
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
            <div className="mb-4 flex items-center gap-3 print:mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">9</span>
              <h3 className="text-xl font-bold text-[#1E7A5A]">ملاحظات إضافية</h3>
            </div>
            <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium leading-relaxed min-h-[100px] print:bg-white print:border-none print:px-0">
              {report.additionalNotes || "لا توجد ملاحظات"}
            </div>
          </div>
        </section>

        {/* ================= 10. SIGNATURES & REJECTION BOX ================= */}
        <section className="mt-12 print:mt-6 print:break-inside-avoid">
          <div className="mb-6 flex items-center gap-4 print:mb-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">10</span>
            <h2 className="text-2xl font-bold text-[#1E7A5A]">الاعتماد والتوقيعات</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
              <h3 className="mb-8 border-b border-[#E7F0EB] pb-4 text-center text-xl font-bold text-[#1E7A5A]">مرشد التعافي (مُنشئ التقرير)</h3>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="font-semibold text-gray-500">الاسم</span>
                  <span className="font-bold text-[#1E7A5A]">
                    {report.doctor ? `${report.doctor.firstName} ${report.doctor.lastName}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="font-semibold text-gray-500">تاريخ الإنشاء</span>
                  <span className="font-bold text-[#1E7A5A]">
                    {new Date(report.createdAt).toLocaleDateString("en-CA")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-300 print:shadow-none print:p-4">
              <h3 className="mb-8 border-b border-[#E7F0EB] pb-4 text-center text-xl font-bold text-[#1E7A5A]">رئيس الفريق (الاعتماد)</h3>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="font-semibold text-gray-500">الاسم</span>
                  <span className="font-bold text-[#1E7A5A]">{teamLeaderFullName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="font-semibold text-gray-500">حالة الاعتماد</span>
                  <span className={`font-bold ${report.approval?.status === "approved" ? "text-green-600" : report.approval?.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>
                    {translateStatus(report.approval?.status)}
                  </span>
                </div>
                {report.approval?.approvedAt && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="font-semibold text-gray-500">تاريخ الاعتماد</span>
                    <span className="font-bold text-[#1E7A5A]">
                      {new Date(report.approval.approvedAt).toLocaleDateString("en-CA")}
                    </span>
                  </div>
                )}
                
                {/* Rejection Reason inside Signature Box */}
                {report.approval?.status === "rejected" && (
                  <div className="flex flex-col gap-2 pt-3">
                    <span className="font-semibold text-red-500">سبب الرفض المسجل</span>
                    <span className="rounded-xl bg-red-50 p-4 font-bold text-red-700 leading-relaxed border border-red-100 print:bg-white print:border-gray-300">
                      {report.approval?.rejectionReason || "لم يتم توضيح السبب."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= TEAM LEADER ACTIONS ================= */}
        {user?.role === "teamLeader" && report?.approval?.status === "pending" && (
          <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row print:hidden">
            <button
              onClick={handleApprove}
              disabled={processing}
              className="flex h-[58px] w-full max-w-[400px] items-center justify-center gap-2 rounded-2xl bg-[#34C759] text-[18px] font-bold text-white transition hover:-translate-y-[1px] hover:bg-[#2EB84E] disabled:opacity-60 sm:flex-1"
            >
              {processing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              {processing ? "جاري الاعتماد..." : "اعتماد التقرير"}
            </button>
            <button
              onClick={handleReject}
              disabled={processing}
              className="flex h-[58px] w-full max-w-[400px] items-center justify-center gap-2 rounded-2xl bg-red-500 text-[18px] font-bold text-white transition hover:-translate-y-[1px] hover:bg-red-600 disabled:opacity-60 sm:flex-1"
            >
              {processing ? <Loader2 className="animate-spin" size={20} /> : <XCircle size={20} />}
              {processing ? "جاري الرفض..." : "رفض التقرير"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostReportPreview;