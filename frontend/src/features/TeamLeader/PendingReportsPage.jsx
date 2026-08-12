import { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import reportService from "../../services/report.service";

const PendingReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadPendingReports();
  }, []);

  const loadPendingReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [preRes, postRes] = await Promise.all([
        reportService.getPendingPreReports(),
        reportService.getPendingPostReports(),
      ]);

      const preReports = (preRes.data?.data || []).map((r) => ({
        ...r,
        reportType: "قبلي",
        reportTypeKey: "pre",
        programName: r.reportInformation?.programName || "-",
      }));

      const postReports = (postRes.data?.data || []).map((r) => ({
        ...r,
        reportType: "بعدي",
        reportTypeKey: "post",
        programName: r.beneficiaryInformation?.programName || "-",
      }));

      const combined = [...preReports, ...postReports].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setReports(combined);
    } catch (err) {
      setError("فشل في تحميل التقارير المعلقة.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, typeKey) => {
    try {
      setProcessingId(id);
      if (typeKey === "pre") await reportService.approvePreReport(id);
      if (typeKey === "post") await reportService.approvePostReport(id);
      
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ أثناء الاعتماد.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id, typeKey) => {
    const reason = window.prompt("يرجى إدخال سبب الرفض:");
    if (!reason) return; // Cancelled or empty

    try {
      setProcessingId(id);
      if (typeKey === "pre") await reportService.rejectPreReport(id, reason);
      if (typeKey === "post") await reportService.rejectPostReport(id, reason);
      
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ أثناء الرفض.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div dir="rtl" className="mx-auto max-w-[1300px]">
      <PageHeader
        title="التقارير المعلقة"
        description="مراجعة واعتماد التقارير المرفوعة من أطباء الفريق"
      />

      {loading ? (
        <div className="py-20 text-center text-gray-500">جاري التحميل...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr className="text-right text-gray-600">
                <th className="px-6 py-5 font-semibold">نوع التقرير</th>
                <th className="px-6 py-5 font-semibold">اسم البرنامج</th>
                <th className="px-6 py-5 font-semibold">اسم المرشد</th>
                <th className="px-6 py-5 font-semibold">اسم المستفيد</th>
                <th className="px-6 py-5 font-semibold">تاريخ الرفع</th>
                <th className="px-6 py-5 text-center font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report._id} className="border-t transition hover:bg-gray-50">
                    <td className="px-6 py-5 font-bold text-[#1E7A5A]">
                      {report.reportType}
                    </td>
                    <td className="px-6 py-5 text-gray-700">{report.programName}</td>
                    <td className="px-6 py-5 text-gray-700">
                      {report.doctor ? `${report.doctor.firstName} ${report.doctor.lastName}` : "-"}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-800">
                      {report.patient ? `${report.patient.firstName} ${report.patient.lastName}` : "-"}
                    </td>
                    <td className="px-6 py-5 text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString("en-CA")}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* Preview */}
                        <button
                          title="معاينة التقرير"
                          onClick={() => navigate(`/team-leader/${report.reportTypeKey}-reports/${report._id}`)}
                          className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                        >
                          <Eye size={20} />
                        </button>
                        
                        {/* Approve */}
                        <button
                          title="اعتماد"
                          disabled={processingId === report._id}
                          onClick={() => handleApprove(report._id, report.reportTypeKey)}
                          className="rounded-lg bg-green-100 p-2 text-green-600 transition hover:bg-green-200 disabled:opacity-50"
                        >
                          {processingId === report._id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                        </button>

                        {/* Reject */}
                        <button
                          title="رفض"
                          disabled={processingId === report._id}
                          onClick={() => handleReject(report._id, report.reportTypeKey)}
                          className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200 disabled:opacity-50"
                        >
                          {processingId === report._id ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-lg text-gray-400">
                    لا توجد تقارير معلقة بانتظار الاعتماد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingReportsPage;