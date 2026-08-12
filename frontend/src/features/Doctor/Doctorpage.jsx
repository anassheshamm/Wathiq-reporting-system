import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import PatientsTable from "./PatientsTable";
import patientService from "../../services/patient.service";
import { useSearch } from "../../context/SearchContext";

const DoctorsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Get the search term from context
  const { searchTerm } = useSearch();

  // DEBUG LOG 1: Check if the context is updating when you type
  console.log("Current Search Term on Page:", searchTerm);

  // 2. Trigger fetch when searchTerm changes (with a 500ms delay)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadPatients();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "-";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      // DEBUG LOG 2: Check exactly what is being sent to the API
      console.log("Sending to API:", searchTerm);

      // 3. Fetch from backend using the search term
      const response = await patientService.getAllPatients(searchTerm);
      const rawPatients = response.data || [];

      // 4. MAP THE DATA! (This is what makes the table display correctly)
      const mappedPatients = rawPatients.map((patient) => ({
        _id: patient._id,
        fullName: [patient.firstName, patient.middleName, patient.lastName]
          .filter(Boolean)
          .join(" "),
        age: calculateAge(patient.dateOfBirth),
        nationalId: patient.nationalId || "-",
        phone: patient.phone || "-",
        email: patient.email || "-",
        joinDate: patient.createdAt
          ? new Date(patient.createdAt).toLocaleDateString("en-GB")
          : "-",
      }));

      // 5. Save the properly formatted data to state
      setPatients(mappedPatients);
    } catch (err) {
      console.error("ERROR:", err);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء تحميل المستفيدين"
      );
    } finally {
      setLoading(false);
    }
  };
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
    <div className="mx-auto max-w-[1300px]">
      <PageHeader
        title="لائحة المستفيدين"
        description="عرض وإدارة جميع ملفات المستفيدين الخاصة بالمركز"
        downloadText="تنزيل لائحة المستفيدين"
        onDownload={handleDownload}

      />

      {loading ? (
        <div className="rounded-3xl bg-white py-24 text-center text-lg">
          جاري تحميل المستفيدين...
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-red-50 py-24 text-center text-red-600">
          {error}
        </div>
      ) : (
        <PatientsTable patients={patients} />
      )}
    </div>
  );
};

export default DoctorsPage;