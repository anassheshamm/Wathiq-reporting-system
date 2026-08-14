import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import userService from "../../services/user.service";

const TeamDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getMyTeam()
      .then((res) => setDoctors(res.data?.data || []))
      .catch((err) => console.error("Error fetching doctors", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl" className="mx-auto max-w-[1300px]">
      <PageHeader title="أعضاء الفريق" description="قائمة الأطباء والمرشدين المعينين تحت إشرافك" />

      {loading ? (
        <div className="py-20 text-center text-gray-500">جاري التحميل...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-[#4FA0B7]/30">
              <tr className="text-right text-gray-600">
                <th className="px-6 py-5 font-semibold">الاسم</th>
                <th className="px-6 py-5 font-semibold">رقم الهوية</th>
                <th className="px-6 py-5 font-semibold">رقم الهاتف</th>
                <th className="px-6 py-5 font-semibold">البريد الإلكتروني</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr key={doctor._id} className="border-t transition hover:bg-gray-50">
                    <td className="px-6 py-5 font-bold text-[#1E7A5A]">
                      {doctor.firstName} {doctor.lastName}
                    </td>
                    <td className="px-6 py-5 text-gray-700">{doctor.nationalId}</td>
                    <td className="px-6 py-5 text-gray-700">{doctor.phone}</td>
                    <td className="px-6 py-5 text-gray-700">{doctor.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-lg text-gray-400">لا يوجد أطباء في فريقك حالياً. (يتم التعيين التلقائي عند اعتماد أول تقرير)</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamDoctorsPage;