import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Printer, CheckCircle, XCircle } from "lucide-react";
import api from "../../services/api";
import reportService from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const ReportPreviewPage = () => {
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
        const response = await api.get(`/pre-reports/${reportId}`);
        setReport(response.data.data || response.data);
      } catch (err) {
        setError("فشل في تحميل تفاصيل التقرير القبلي.");
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
      text: "هل أنت متأكد من رغبتك في اعتماد هذا التقرير القبلي؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#35C759",
      cancelButtonColor: "#888",
      confirmButtonText: "نعم، اعتمده",
      cancelButtonText: "إلغاء",
      customClass: { popup: "font-['Cairo']" },
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(true);
      await reportService.approvePreReport(reportId);
      
      await Swal.fire({
        title: "تم بنجاح",
        text: "تم اعتماد التقرير القبلي بنجاح",
        icon: "success",
        confirmButtonColor: "#35C759",
        customClass: { popup: "font-['Cairo']" },
      });

      navigate("/team-leader");
    } catch (err) {
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء الاعتماد.",
        icon: "error",
        confirmButtonColor: "#35C759",
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
      await reportService.rejectPreReport(reportId, reason);

      await Swal.fire({
        title: "تم الرفض",
        text: "تم رفض التقرير القبلي بنجاح",
        icon: "success",
        confirmButtonColor: "#35C759",
        customClass: { popup: "font-['Cairo']" },
      });

      navigate("/team-leader");
    } catch (err) {
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء الرفض.",
        icon: "error",
        confirmButtonColor: "#35C759",
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
  const translateMotivation = (val) => ({ personal: "شخصي", family: "عائلي", legal: "قانوني", other: "أخرى" }[val] || val);
  const translatePsychological = (val) => ({ stable: "مستقر", mild_disorder: "يعاني من اضطراب طفيف", severe_disorder: "يعاني من اضطراب شديد" }[val] || val);
  const translateBehavioral = (val) => ({ cooperative: "تعاوني ومتجاوب", hesitant: "متردد", aggressive: "عدواني أو مقاوم" }[val] || val);
  const translateCommitment = (val) => ({ high: "عالية", medium: "متوسطة", low: "ضعيفة" }[val] || val);
  const translateStatus = (status) => ({ pending: "قيد الانتظار", approved: "معتمد", rejected: "مرفوض" }[status] || status);

  const patientFullName = report.patient ? `${report.patient.firstName || ""} ${report.patient.middleName || ""} ${report.patient.lastName || ""}` : "غير متوفر";
  const teamLeaderFullName = report.teamLeader ? `${report.teamLeader.firstName || ""} ${report.teamLeader.lastName || ""}` : "غير متوفر";

  return (
    <div dir="rtl"
    className="min-h-screen font-['Cairo',sans-serif] text-[15px] leading-[1.9] text-[#27343A] print:bg-white print:bg-none">
     
    
      <div className="mx-auto my-10 w-full max-w-[1100px] px-5 md:px-10 print:my-0 print:px-0 print:max-w-none">
        
        {/* Header Actions */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <ArrowRight size={20} />
            رجوع
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-[#4FA0B7] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#4FA0B7]/90">
            <Printer size={20} />
            طباعة التقرير
          </button>
        </div>

        {/* ================= LETTERHEAD ================= */}
        <header className=" rounded-[28px] border border-[#E7F0EB] bg-white/95 p-[28px] shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-none print:shadow-none print:p-0">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-12 print:mb-4">
            <img src="/logo.png" alt="Logo" className="h-16 object-contain" />
            <img src="/logo2.png" alt="Logo" className="h-16 object-contain" />
          </div>
          <div className="my-6 h-[2px] w-full bg-gradient-to-r from-transparent via-[#4FA0B7] to-transparent print:bg-[#4FA0B7]" />
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-[#31778b]">التقرير القبلي للمستفيد</h1>
              <p className="mt-2 text-gray-500">برنامج التأهيل والتعافي</p>
            </div>
            <div className="rounded-full bg-[#4FA0B7]/20 border border-[#4FA0B7]/10 px-8 py-3 font-bold text-[#4FA0B7]">
              قبلي (نسخة معاينة)
            </div>
          </div>
        </header>

        {/* ================= REJECTION ALERT ================= */}
        {report.approval?.status === "rejected" && (
          <div className="mb-10 rounded-[22px] border-2 border-red-200 bg-red-50 p-8 shadow-sm">
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
        <section className="mt-8">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#31778b]/10 font-bold text-[#4FA0B7]">1</span>
            <h2 className="text-2xl font-bold text-[#31778b]">البيانات الأساسية</h2>
          </div>
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)]">
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">اسم المستفيد</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">{patientFullName}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">رقم الهوية</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">{report.patient?.nationalId || "-"}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">اسم البرنامج</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">{report.reportInformation?.programName || "-"}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">تاريخ بداية البرنامج</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">
                  {report.reportInformation?.startDate ? new Date(report.reportInformation.startDate).toLocaleDateString("en-CA") : "-"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. GENERAL CASE INFORMATION ================= */}
        <section className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#31778b]/10 font-bold text-[#4FA0B7]">2</span>
            <h2 className="text-2xl font-bold text-[#31778b]">معلومات عامة عن الحالة</h2>
          </div>
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)]">
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">شدة الإدمان</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">{report.generalCaseInformation?.addictionSeverity || "-"}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">نوع التعاطي السابق</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">{report.generalCaseInformation?.previousSubstanceType || "-"}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">مدة التعاطي</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">{report.generalCaseInformation?.addictionDuration || "-"}</div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[#31778b]">عدد محاولات التعافي السابقة</span>
                <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#31778b]/5 px-5 py-4 font-medium">{report.generalCaseInformation?.previousRecoveryAttempts ?? "-"}</div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#E7F0EB] pt-8">
              <span className="mb-4 block font-semibold text-[#31778b]">الدافع للالتحاق بالبرنامج</span>
              <div className="flex flex-wrap gap-4">
                {report.generalCaseInformation?.motivations?.map((m, idx) => (
                  <div key={idx} className="rounded-xl bg-[#f8f9fc] border border-[#31778b] px-6 py-3 font-bold text-[#4FA0B7]">
                    {translateMotivation(m)}
                  </div>
                ))}
                {(!report.generalCaseInformation?.motivations || report.generalCaseInformation.motivations.length === 0) && (
                  <div className="text-gray-500">لا يوجد دوافع مسجلة</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. INITIAL EVALUATIONS ================= */}
        <section className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#31778b]/10 font-bold text-[#31778b]">3</span>
            <h2 className="text-2xl font-bold text-[#31778b]">التقييمات الأولية</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)]">
              <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#31778b]">التقييم النفسي الأولي</h3>
              <div className="rounded-xl border border-[#31778b] bg-[#31778b]/5 px-4 py-4 text-center font-bold text-[#343e41]">
                {translatePsychological(report.initialEvaluations?.psychologicalStatus)}
              </div>
            </div>
            <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)]">
              <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#31778b  ]">التقييم السلوكي</h3>
              <div className="rounded-xl border border-[#31778b] bg-[#31778b]/5 px-4 py-4 text-center font-bold text-[#343e41]">
                {translateBehavioral(report.initialEvaluations?.behavioralStatus)}
              </div>
            </div>
            <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)]">
              <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#31778b]">القدرة على الالتزام</h3>
              <div className="rounded-xl border border-[#31778b] bg-[#31778b]/5 px-4 py-4 text-center font-bold text-[#343e41]">
                {translateCommitment(report.initialEvaluations?.programCommitment)}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. RECOMMENDATIONS ================= */}
        <section className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#31778b]/10 font-bold text-[#31778b]">4</span>
            <h2 className="text-2xl font-bold text-[#31778b]">التوصيات الأولية</h2>
          </div>
          <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)]">
            <div className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 font-medium leading-relaxed min-h-[120px]">
              {report.initialRecommendations?.recommendations || "لا توجد توصيات"}
            </div>
          </div>
        </section>

        {/* ================= 5. SIGNATURES & REJECTION BOX ================= */}
        <section className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#31778b]/10 font-bold text-[#31778b]">5</span>
            <h2 className="text-2xl font-bold text-[#31778b]">الاعتماد والتوقيعات</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)]">
              <h3 className="mb-8 border-b border-[#E7F0EB] pb-4 text-center text-xl font-bold text-[#31778b]">مرشد التعافي (مُنشئ التقرير)</h3>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="font-semibold text-gray-500">الاسم</span>
                  <span className="font-bold text-[#31778b]">
                    {report.doctor ? `${report.doctor.firstName} ${report.doctor.lastName}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="font-semibold text-gray-500">تاريخ الإنشاء</span>
                  <span className="font-bold text-[#31778b]">
                    {new Date(report.createdAt).toLocaleDateString("en-CA")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)]">
              <h3 className="mb-8 border-b border-[#E7F0EB] pb-4 text-center text-xl font-bold text-[#31778b]">رئيس الفريق (الاعتماد)</h3>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="font-semibold text-gray-500">الاسم</span>
                  <span className="font-bold text-[#31778b]">{teamLeaderFullName}</span>
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
                    <span className="rounded-xl bg-red-50 p-4 font-bold text-red-700 leading-relaxed border border-red-100">
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
              {processing ? <Loader2 className="animate-spin" size= {20} /> : <CheckCircle size={20} />}
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

export default ReportPreviewPage;