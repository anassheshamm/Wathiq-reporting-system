import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import patientService from "../../services/patient.service";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeamPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    patientService.getPatients()
      .then((res) => setPatients(res.data?.data || []))
      .catch((err) => console.error("Error fetching patients", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl" className="mx-auto max-w-[1300px]">
     <PageHeader title="مستفيدي الفريق" description="جميع المستفيدين المسجلين لدى الفريق" />

      {loading ? (
        <div className="py-20 text-center text-gray-500">جاري التحميل...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-[#4FA0B7]/30">
              <tr className="text-right text-gray-600">
                <th className="px-6 py-5 font-semibold">رقم الهوية</th>
                <th className="px-6 py-5 font-semibold">اسم المستفيد</th>
                <th className="px-6 py-5 font-semibold">المرشد المعالج</th>
                <th className="px-6 py-5 text-center font-semibold">ملف المستفيد</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient._id} className="border-t transition hover:bg-gray-50">
                    <td className="px-6 py-5 text-gray-700">{patient.nationalId}</td>
                    <td className="px-6 py-5 font-bold text-[#4FA0B7]">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="px-6 py-5 text-gray-700">
                      {patient.doctor ? `${patient.doctor.firstName} ${patient.doctor.lastName}` : "-"}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => navigate(`/team-leader/patient/${patient._id}`)}
                          className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-[#EDF8F2] hover:text-[#247C5A]"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-lg text-gray-400">لا يوجد مستفيدين مسجلين لدى فريقك حالياً.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamPatientsPage;