import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorRow = ({ doctor }) => {
  // Construct full name from backend user model
  const fullName = [doctor.firstName, doctor.middleName, doctor.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className="border-t border-[#EDF2EF] transition hover:bg-[#FAFCFB]">
      <td className="px-8 py-6 font-medium text-[#202020]">
        {fullName || "غير محدد"}
      </td>

      <td className="px-8 py-6">
        {doctor.nationalId || "-"}
      </td>

      <td className="px-8 py-6">
        {doctor.phone || "-"}
      </td>

      {/* <td className="px-8 py-6">
        <span className="rounded-full bg-[#EDF8F2] px-3 py-1 text-xs font-semibold text-[#247C5A]">
          {doctor.role || "doctor"}
        </span>
      </td> */}

      <td className="px-8 py-6">
        {doctor.email || "-"}
      </td>

      <td className="px-8 py-6 text-center font-semibold">
        {doctor.isActive ? (
          <span className="text-emerald-600">نشط</span>
        ) : (
          <span className="text-rose-500">غير نشط</span>
        )}
      </td>

      {/* <td className="px-8 py-6">
        <div className="flex justify-center">
          <Link
            to={`/admin/doctors/${doctor._id}`}
            className="flex items-center gap-2 text-[#247C5A] transition hover:opacity-80"
          >
            <Eye size={18} />
            <span className="font-medium">معاينة</span>
          </Link>
        </div>
      </td> */}
    </tr>
  );
};

export default DoctorRow;