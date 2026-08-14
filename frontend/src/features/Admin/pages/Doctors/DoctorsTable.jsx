import DoctorRow from "./DoctorRow";

const DoctorsTable = ({ doctors = [] }) => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#E8F2EC] bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#4FA0B7]/30 text-[#1F1F1F]">
            <th className="px-8 py-6 text-right font-semibold">الاسم</th>
            <th className="px-8 py-6 text-right font-semibold">رقم الهوية</th>
            <th className="px-8 py-6 text-right font-semibold">رقم الهاتف</th>
            {/* <th className="px-8 py-6 text-right font-semibold">الدور</th> */}
            <th className="px-8 py-6 text-right font-semibold">البريد الإلكتروني</th>
            <th className="px-8 py-6 text-center font-semibold">الحالة</th>
            {/* <th className="px-8 py-6 text-center font-semibold">رؤية ملف المعالج</th> */}
          </tr>
        </thead>

        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <DoctorRow key={doctor._id} doctor={doctor} />
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="py-20 text-center text-lg text-gray-400"
              >
                لا يوجد معالجون
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;