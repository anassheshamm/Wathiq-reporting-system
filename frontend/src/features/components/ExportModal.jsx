import React, { useState } from "react";
import Swal from "sweetalert2";
import { Loader2, X } from "lucide-react";
import api from "../../services/api";

const ExportModal = ({ isOpen, onClose }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!from || !to) {
      Swal.fire({
        title: "تنبيه",
        text: "يرجى تحديد تاريخ البداية والنهاية",
        icon: "warning",
        confirmButtonColor: "#247C5A",
        customClass: { popup: "font-['Cairo']" },
      });
      return;
    }

    try {
      setExporting(true);
      
      // Call the backend Excel export route[cite: 1]
      const response = await api.get("/export/excel", {
        params: { from, to },
        responseType: "blob", // CRITICAL for Excel files
      });
      
      const blob = response.data;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `تقرير_المستفيدين_${from}_إلى_${to}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire({
        title: "خطأ",
        text: "فشل في تصدير التقرير، تأكد من صلاحياتك.",
        icon: "error",
        confirmButtonColor: "#4FA0B7",
        customClass: { popup: "font-['Cairo']" },
      });
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-['Cairo']" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#111827]">تصدير تقرير Excel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <div>
            <label className="mb-2 block font-medium text-gray-700">من تاريخ: </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#4FA0B7]"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">إلى تاريخ: </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#4FA0B7]"
            />
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4FA0B7] py-3 font-bold text-white transition hover:bg-[#4FA0B7]/90 disabled:opacity-70"
        >
          {exporting ? <Loader2 className="animate-spin" size={20} /> : "تصدير"}
        </button>
      </div>
    </div>
  );
};

export default ExportModal;