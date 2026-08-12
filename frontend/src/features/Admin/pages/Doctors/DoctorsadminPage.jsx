import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import DoctorsTable from "./DoctorsTable";
import api from "../../../../services/api";

const DoctorsadminPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch users and filter by the 'doctor' role
        const response = await api.get("/users", {
          params: { role: "doctor" }
        });

        if (response.data.success) {
          setDoctors(response.data.data || []);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "فشل في تحميل قائمة الأطباء."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);
    const handleDownload = () => {
    if (!patients.length) return;
    
    const headers = ["الاسم", "رقم الهوية", "الهاتف", "البريد الإلكتروني"];
    const rows = patients.map((p) => [
      `${p.firstName || ""} ${p.lastName || ""}`.trim(),
      p.nationalId || "",
      p.phone || "",
      p.email || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patients_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div dir="rtl" className="mx-auto max-w-[1300px]">
      <PageHeader
        title="إدارة المعالجين"
        description="عرض وإدارة حسابات المعالجين ومرشدي التعافي"
        downloadText="تنزيل لائحة المعالجين"
        onDownload={handleDownload}
      />

      {loading ? (
        <div className="py-20 text-center text-gray-500">جاري التحميل...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">{error}</div>
      ) : (
        <DoctorsTable doctors={doctors} />
      )}
    </div>
  );
};

export default DoctorsadminPage;