import { useEffect, useState } from "react";
import HeadsHeader from "../../../components/PageHeader";
import HeadsTable from "./HeadsTable";
import api from "../../../../services/api";

const HeadsPage = () => {
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHeads = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch users and filter by the 'teamLeader' role to match backend
        const response = await api.get("/users", {
          params: { role: "teamLeader" } 
        });

        if (response.data.success) {
          setHeads(response.data.data || []);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "فشل في تحميل قائمة رؤساء الفرق."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHeads();
  }, []);

  const handleDownload = () => {
    if (!heads.length) return;

    const headers = ["الاسم", "رقم الهوية", "رقم الهاتف", "البريد الإلكتروني"];
    const rows = heads.map((h) => [
      `${h.firstName || ""} ${h.lastName || ""}`.trim(),
      h.nationalId || "",
      h.phone || "",
      h.email || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "team_leaders_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div dir="rtl" className="mx-auto max-w-[1350px] px-8 py-10">
      <HeadsHeader
      title="إدارة رؤساء الفرق"
        description="عرض وإدارة حسابات رؤساء الفرق"
        downloadText="تصدير القائمة"
      onDownload={handleDownload} />

      <div className="mt-10">
        {loading ? (
          <div className="py-20 text-center text-gray-500">جاري التحميل...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : (
          <HeadsTable heads={heads} />
        )}
      </div>
    </div>
  );
};

export default HeadsPage;