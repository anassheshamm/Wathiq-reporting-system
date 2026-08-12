import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import patientService from "../../services/patient.service";
import userService from "../../services/user.service";
import reportService from "../../services/report.service";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../components/BackButton";
import Swal from "sweetalert2";

const PostReportPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patient, setPatient] = useState(null);
  const [teamLeaders, setTeamLeaders] = useState([]);

  // State mapped exactly to postReport schema
  const [formData, setFormData] = useState({
    patient: patientId || "",
    teamLeader: "", 
    
    beneficiaryInformation: {
      programName: "",
      counselorName: "",
      startDate: "",
      graduationDate: "",
    },
    
    caseSummary: {
      summary: "",
      addictionSeverity: "", 
    },
    
    progressAssessment: {
      psychologicalStatus: "", 
      behavioralStatus: "", 
      socialStatus: "", 
    },
    
    programProgress: {
      overallImprovement: "", 
      treatmentCommitment: "", 
      activityParticipation: "", 
      emotionalStability: "", 
      familyRelationship: "", 
      communityReadiness: "", 
    },
    
    recoveryStability: "", 
    personalPlanReadiness: "", 
    
    familyNotification: {
      notes: "",
    },
    
    recommendations: "",
    additionalNotes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Load Patient Details
        const patientRes = await patientService.getPatientById(patientId);
        const actualPatient = patientRes?.data?.patient || patientRes?.patient || patientRes;
        setPatient(actualPatient);

        // 2. Load Team Leaders for the dropdown
        const tlRes = await userService.getTeamLeaders();
        setTeamLeaders(tlRes.data?.data || []);
        
      } catch (error) {
        console.error("Failed to load data", error);
        Swal.fire({
          title: "خطأ",
          text: "حدث خطأ أثناء تحميل البيانات",
          icon: "error",
          confirmButtonColor: "#35C759",
          confirmButtonText: "حسناً",
          customClass: { popup: "font-['Cairo']" },
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFlatChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.teamLeader) {
      Swal.fire({
        title: "تنبيه",
        text: "الرجاء اختيار رئيس الفريق قبل إرسال التقرير.",
        icon: "warning",
        confirmButtonColor: "#35C759",
        confirmButtonText: "حسناً",
        customClass: { popup: "font-['Cairo']" },
      });
      return;
    }

    setSaving(true);
    
    try {
      await reportService.createPostReport(formData);

      await Swal.fire({
        title: "عملية ناجحة",
        text: "تم إرسال التقرير البعدي بنجاح إلى رئيس الفريق للمراجعة والاعتماد.",
        icon: "success",
        confirmButtonColor: "#35C759",
        confirmButtonText: "استمرار",
        customClass: { popup: "font-['Cairo']" },
      });
      
      navigate(`/doctor/patient/${patientId}`);
      
    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire({
        title: "خطأ",
        text: error?.response?.data?.message || "حدث خطأ أثناء إرسال التقرير",
        icon: "error",
        confirmButtonColor: "#35C759",
        confirmButtonText: "حسناً",
        customClass: { popup: "font-['Cairo']" },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-['Cairo'] text-lg text-[#1E7A5A]">
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#F6FCF9] to-white font-['Cairo',sans-serif] text-[15px] leading-[1.9] text-[#27343A] print:bg-white"
    >
      {/* BackButton hidden on print */}
      <div className="print:hidden">
        <BackButton />
      </div>

      <div className="mx-auto my-10 w-full max-w-[1100px] px-5 md:px-10 print:my-0 print:max-w-none print:px-0">
        
        {/* ================= LETTERHEAD ================= */}
        <header className="rounded-[28px] border border-[#E7F0EB] bg-white/95 p-[28px] shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-none print:shadow-none print:p-0">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-12 print:mb-4">
            <img src="/logo.png" alt="Logo" className="h-16 object-contain" />
            <img src="/logo2.png" alt="Logo" className="h-16 object-contain" />
          </div>

          <div className="my-6 h-[2px] w-full bg-gradient-to-r from-transparent via-[#34C759] to-transparent print:bg-[#34C759]" />

          <div className="flex flex-col justify-between gap-6 md:flex-row print:flex-row print:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#1E7A5A]">
                التقرير البعدي
              </h1>
              <p className="mt-2 text-gray-500">
                تقرير متابعة وتقييم المتعافي
              </p>
            </div>
            <div className="rounded-full bg-[#EAF5F0] border border-[#1E7A5A]/10 px-8 py-3 font-bold text-[#1E7A5A]">
              بعدي
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 print:mt-6">
          
          {/* ================= 1. PATIENT & PROGRAM INFO ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">
                1
              </span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">البيانات الأساسية</h2>
            </div>

            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-200 print:shadow-none print:p-4">
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 print:gap-4">
                
                {/* Beneficiary Name (Auto-filled) */}
                <div className="flex flex-col gap-3 print:gap-1">
                  <label className="font-semibold text-[#1E7A5A]">اسم المستفيد</label>
                  <input
                    type="text"
                    value={patient ? `${patient.firstName || ""} ${patient.middleName || ""} ${patient.lastName || ""}` : ""}
                    readOnly
                    className="w-full rounded-xl border border-[#E7F0EB] bg-gray-100 px-5 py-4 text-gray-600 outline-none print:bg-white print:border-gray-300 print:py-2"
                  />
                </div>

                {/* National ID (Auto-filled) */}
                <div className="flex flex-col gap-3 print:gap-1">
                  <label className="font-semibold text-[#1E7A5A]">رقم الهوية</label>
                  <input
                    type="text"
                    value={patient?.nationalId || ""}
                    readOnly
                    className="w-full rounded-xl border border-[#E7F0EB] bg-gray-100 px-5 py-4 text-gray-600 outline-none print:bg-white print:border-gray-300 print:py-2"
                  />
                </div>

                {/* Program Name */}
                <div className="flex flex-col gap-3 print:gap-1">
                  <label className="font-semibold text-[#1E7A5A]">اسم البرنامج</label>
                  <input
                    type="text"
                    value={formData.beneficiaryInformation.programName}
                    onChange={(e) => handleNestedChange("beneficiaryInformation", "programName", e.target.value)}
                    placeholder="اسم البرنامج"
                    className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:py-2"
                    required
                  />
                </div>

                {/* Counselor Name */}
                <div className="flex flex-col gap-3 print:gap-1">
                  <label className="font-semibold text-[#1E7A5A]">اسم المرشد</label>
                  <input
                    type="text"
                    value={formData.beneficiaryInformation.counselorName}
                    onChange={(e) => handleNestedChange("beneficiaryInformation", "counselorName", e.target.value)}
                    placeholder="اسم المرشد"
                    className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:py-2"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="flex flex-col gap-3 print:gap-1">
                  <label className="font-semibold text-[#1E7A5A]">تاريخ البدء</label>
                  <input
                    type="date"
                    value={formData.beneficiaryInformation.startDate}
                    onChange={(e) => handleNestedChange("beneficiaryInformation", "startDate", e.target.value)}
                    className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:py-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 print:gap-1">
                  <label className="font-semibold text-[#1E7A5A]">تاريخ التخرج</label>
                  <input
                    type="date"
                    value={formData.beneficiaryInformation.graduationDate}
                    onChange={(e) => handleNestedChange("beneficiaryInformation", "graduationDate", e.target.value)}
                    className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:py-2"
                    required
                  />
                </div>

                {/* Team Leader Dropdown */}
                <div className="flex flex-col gap-3 md:col-span-2 print:gap-1 print:hidden">
                  <label className="font-semibold text-[#1E7A5A]">رئيس الفريق (للاعتماد)</label>
                  <select
                    name="teamLeader"
                    value={formData.teamLeader}
                    onChange={(e) => handleFlatChange("teamLeader", e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759]"
                  >
                    <option value="">اختر رئيس الفريق...</option>
                    {teamLeaders.map((tl) => (
                      <option key={tl._id} value={tl._id}>
                        {tl.firstName} {tl.lastName}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          </section>

          {/* ================= 2. CASE SUMMARY ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">
                2
              </span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">ملخص الحالة المتعلق بتعديل الوضع</h2>
            </div>

            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-200 print:shadow-none print:p-4">
              <div className="flex flex-col gap-3 print:gap-1">
                <label className="font-semibold text-[#1E7A5A]">ملخص الحالة</label>
                <textarea
                  value={formData.caseSummary.summary}
                  onChange={(e) => handleNestedChange("caseSummary", "summary", e.target.value)}
                  placeholder="اكتب ملخص الحالة..."
                  className="min-h-[170px] w-full resize-y rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:min-h-[80px]"
                  required
                />
              </div>

              <div className="my-8 h-[1px] w-full bg-[#E7F0EB] print:my-4"></div>

              <div className="flex flex-col gap-3 print:gap-1">
                <label className="font-semibold text-[#1E7A5A]">شدة الإدمان</label>
                <div className="flex flex-wrap gap-4 mt-2 print:gap-2">
                  {[
                    { label: "خفيفة", val: "mild" },
                    { label: "متوسطة", val: "moderate" },
                    { label: "شديدة", val: "severe" }
                  ].map((option) => (
                    <label key={option.val} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E7F0EB] bg-[#F8FCFA] px-5 py-3 transition hover:bg-[#F2FBF5] hover:border-[#34C759] print:bg-white print:border-gray-300 print:px-3 print:py-1">
                      <input
                        type="radio"
                        value={option.val}
                        checked={formData.caseSummary.addictionSeverity === option.val}
                        onChange={(e) => handleNestedChange("caseSummary", "addictionSeverity", e.target.value)}
                        className="accent-[#34C759] h-5 w-5"
                        required
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= 3. PROGRESS ASSESSMENT ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">
                3
              </span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">قياس التقدم في الجوانب التالية</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 print:gap-4">
              {/* Psychological */}
              <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-200 print:shadow-none print:p-4">
                <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#1E7A5A] print:mb-2 print:pb-2">1- الجانب النفسي</h3>
                {[
                  { label: "تحسن ملحوظ", val: "significant_improvement" },
                  { label: "تحسن متوسط", val: "moderate_improvement" },
                  { label: "لا يوجد تحسن", val: "no_improvement" }
                ].map((opt) => (
                  <label key={opt.val} className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E7F0EB] bg-white px-4 py-3 transition hover:bg-[#F4FCF7] hover:border-[#34C759] print:border-gray-200 print:p-2 print:mb-1">
                    <input type="radio" value={opt.val} checked={formData.progressAssessment.psychologicalStatus === opt.val} onChange={(e) => handleNestedChange("progressAssessment", "psychologicalStatus", e.target.value)} className="accent-[#34C759] h-[18px] w-[18px]" required />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Behavioral */}
              <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-200 print:shadow-none print:p-4">
                <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#1E7A5A] print:mb-2 print:pb-2">2- الجانب السلوكي</h3>
                {[
                  { label: "التزام عالي", val: "high_commitment" },
                  { label: "التزام متوسط", val: "medium_commitment" },
                  { label: "صعوبة في الالتزام", val: "difficulty_commitment" }
                ].map((opt) => (
                  <label key={opt.val} className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E7F0EB] bg-white px-4 py-3 transition hover:bg-[#F4FCF7] hover:border-[#34C759] print:border-gray-200 print:p-2 print:mb-1">
                    <input type="radio" value={opt.val} checked={formData.progressAssessment.behavioralStatus === opt.val} onChange={(e) => handleNestedChange("progressAssessment", "behavioralStatus", e.target.value)} className="accent-[#34C759] h-[18px] w-[18px]" required />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Social */}
              <div className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-200 print:shadow-none print:p-4">
                <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#1E7A5A] print:mb-2 print:pb-2">3- الجانب الاجتماعي</h3>
                {[
                  { label: "تفاعل إيجابي", val: "positive_interaction" },
                  { label: "تفاعل محدود", val: "limited_interaction" },
                  { label: "عزلة اجتماعية", val: "social_isolation" }
                ].map((opt) => (
                  <label key={opt.val} className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E7F0EB] bg-white px-4 py-3 transition hover:bg-[#F4FCF7] hover:border-[#34C759] print:border-gray-200 print:p-2 print:mb-1">
                    <input type="radio" value={opt.val} checked={formData.progressAssessment.socialStatus === opt.val} onChange={(e) => handleNestedChange("progressAssessment", "socialStatus", e.target.value)} className="accent-[#34C759] h-[18px] w-[18px]" required />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ================= 4. PROGRAM PROGRESS ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">
                4
              </span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">مدى تقدم المتعافي في البرنامج</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 print:gap-4">
              {[
                { field: "overallImprovement", title: "1- التحسن العام", opts: [{l:"ملحوظ جداً", v:"excellent"}, {l:"جيد", v:"good"}, {l:"محدود", v:"limited"}] },
                { field: "treatmentCommitment", title: "2- مدى الالتزام بالخطة العلاجية", opts: [{l:"ملتزم تماماً", v:"fully_committed"}, {l:"ملتزم جزئياً", v:"partially_committed"}, {l:"غير ملتزم", v:"not_committed"}] },
                { field: "activityParticipation", title: "3- المشاركة في الأنشطة", opts: [{l:"نشط", v:"active"}, {l:"متوسط", v:"average"}, {l:"ضعيف", v:"weak"}] },
                { field: "emotionalStability", title: "4- الحالة النفسية والعاطفية", opts: [{l:"مستقرة", v:"stable"}, {l:"متقلبة", v:"fluctuating"}, {l:"مضطربة", v:"disturbed"}] },
                { field: "familyRelationship", title: "5- العلاقة مع الأسرة", opts: [{l:"تحسنت", v:"improved"}, {l:"لا تتغير", v:"unchanged"}, {l:"لا تزال متوترة", v:"still_tense"}] },
                { field: "communityReadiness", title: "6- الاستعداد للاندماج بالمجتمع", opts: [{l:"جاهز", v:"ready"}, {l:"يحتاج دعم إضافي", v:"needs_support"}, {l:"غير مستعد حالياً", v:"not_ready"}] },
              ].map((card) => (
                <div key={card.field} className="rounded-[20px] border border-[#E7F0EB] bg-white p-7 shadow-[0_8px_24px_rgba(30,122,90,0.05)] print:border-gray-200 print:shadow-none print:p-4">
                  <h3 className="mb-6 border-b border-[#E7F0EB] pb-4 text-center text-lg font-bold text-[#1E7A5A] print:mb-2 print:pb-2">{card.title}</h3>
                  {card.opts.map((opt) => (
                    <label key={opt.v} className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E7F0EB] bg-white px-4 py-3 transition hover:bg-[#F4FCF7] hover:border-[#34C759] print:border-gray-200 print:p-2 print:mb-1">
                      <input type="radio" value={opt.v} checked={formData.programProgress[card.field] === opt.v} onChange={(e) => handleNestedChange("programProgress", card.field, e.target.value)} className="accent-[#34C759] h-[18px] w-[18px]" required />
                      <span>{opt.l}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ================= 5. STABILITY ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">5</span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">مدى قدرة المتعافي على الاستقرار بدون انتكاسة</h2>
            </div>
            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-200 print:shadow-none print:p-4">
              <div className="flex flex-wrap gap-4 print:gap-2">
                {[
                  { label: "جيد جداً", val: "very_good" },
                  { label: "مقبول", val: "acceptable" },
                  { label: "ضعيف", val: "weak" }
                ].map((opt) => (
                  <label key={opt.val} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E7F0EB] bg-[#F8FCFA] px-5 py-3 transition hover:bg-[#F2FBF5] hover:border-[#34C759] print:bg-white print:border-gray-300 print:px-3 print:py-1">
                    <input type="radio" value={opt.val} checked={formData.recoveryStability === opt.val} onChange={(e) => handleFlatChange("recoveryStability", e.target.value)} className="accent-[#34C759] h-5 w-5" required />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ================= 6. FUTURE PLAN ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">6</span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">استعداد المتعافي لوضع خطة شخصية لما بعد البرنامج</h2>
            </div>
            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-200 print:shadow-none print:p-4">
              <div className="flex flex-wrap gap-4 print:gap-2">
                {[
                  { label: "جاهز", val: "ready" },
                  { label: "قيد التطوير", val: "under_development" },
                  { label: "غير مستعد", val: "not_ready" }
                ].map((opt) => (
                  <label key={opt.val} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E7F0EB] bg-[#F8FCFA] px-5 py-3 transition hover:bg-[#F2FBF5] hover:border-[#34C759] print:bg-white print:border-gray-300 print:px-3 print:py-1">
                    <input type="radio" value={opt.val} checked={formData.personalPlanReadiness === opt.val} onChange={(e) => handleFlatChange("personalPlanReadiness", e.target.value)} className="accent-[#34C759] h-5 w-5" required />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ================= 7. FAMILY NOTIFICATION ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">7</span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">إشعار الأسرة والعمل خلال فترة التعافي</h2>
            </div>
            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-200 print:shadow-none print:p-4">
              <div className="flex flex-col gap-3 print:gap-1">
                <label className="font-semibold text-[#1E7A5A]">ملاحظات</label>
                <textarea
                  value={formData.familyNotification.notes}
                  onChange={(e) => handleNestedChange("familyNotification", "notes", e.target.value)}
                  placeholder="اكتب الملاحظات المتعلقة بإشعار الأسرة أو جهة العمل..."
                  className="min-h-[170px] w-full resize-y rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:min-h-[80px]"
                />
              </div>
            </div>
          </section>

          {/* ================= 8. RECOMMENDATIONS ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">8</span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">توصيات المرشد</h2>
            </div>
            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-200 print:shadow-none print:p-4">
              <div className="flex flex-col gap-3 print:gap-1">
                <label className="font-semibold text-[#1E7A5A]">التوصيات</label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => handleFlatChange("recommendations", e.target.value)}
                  placeholder="اكتب توصيات المرشد..."
                  className="min-h-[170px] w-full resize-y rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:min-h-[80px]"
                />
              </div>
            </div>
          </section>

          {/* ================= 9. ADDITIONAL NOTES ================= */}
          <section className="mt-12 print:mt-6 print:break-inside-avoid">
            <div className="mb-6 flex items-center gap-4 print:mb-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] font-bold text-[#1E7A5A]">9</span>
              <h2 className="text-2xl font-bold text-[#1E7A5A]">ملاحظات إضافية</h2>
            </div>
            <div className="rounded-[22px] border border-[#E7F0EB] bg-white p-8 shadow-[0_10px_35px_rgba(30,122,90,0.08)] print:border-gray-200 print:shadow-none print:p-4">
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleFlatChange("additionalNotes", e.target.value)}
                placeholder="أي ملاحظات إضافية..."
                className="min-h-[170px] w-full resize-y rounded-xl border border-[#E7F0EB] bg-[#FAFDFC] px-5 py-4 outline-none focus:border-[#34C759] print:bg-white print:border-gray-300 print:min-h-[80px]"
              />
            </div>
          </section>

          {/* ================= ACTIONS ================= */}
          {/* Hidden on print using print:hidden */}
          <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row print:hidden">
            <button
              type="submit"
              disabled={saving}
              className="h-[58px] w-full max-w-[900px] rounded-2xl bg-[#34C759] text-[18px] font-bold text-white transition hover:-translate-y-[1px] hover:bg-[#2EB84E] focus:outline-none focus:ring-4 focus:ring-[#34C759]/20 active:scale-[0.99] disabled:opacity-60 sm:flex-1"
            >
              {saving ? "جاري الحفظ..." : "حفظ التقرير وإرساله"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="h-[58px] w-full max-w-[900px] rounded-2xl border-2 border-[#34C759] bg-white text-[18px] font-bold text-[#1E7A5A] transition hover:-translate-y-[1px] hover:bg-[#34C759] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#34C759]/20 active:scale-[0.99] sm:flex-1"
            >
              طباعة التقرير
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default PostReportPage;