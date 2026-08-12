import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const PatientRow = ({ patient }) => {
  // Construct full name safely from backend fields
  const fullName = [patient.firstName, patient.middleName, patient.lastName]
    .filter(Boolean)
    .join(" ");

  // Extract assigned doctor full name if populated (Changed from therapist to doctor)
  const doctorName = patient.doctor
    ? [patient.doctor.firstName, patient.doctor.middleName, patient.doctor.lastName]
        .filter(Boolean)
        .join(" ")
    : "غير محدد";

  return (
    <tr className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:bg-[#FAFCFB]">
      <td className="rounded-r-2xl px-6 py-5 text-right font-medium text-[#2F2F2F]">
        {fullName || "غير محدد"}
      </td>

      <td className="px-6 py-5 text-right text-gray-600">
        {patient.nationalId || "-"}
      </td>

      <td className="px-6 py-5 text-right text-gray-600">
        {patient.phone || "-"}
      </td>

      {/* Program column removed as it doesn't exist in backend */}

      <td className="px-6 py-5 text-right text-gray-600">
        {patient.email || "-"}
      </td>

      <td className="px-6 py-5 text-right font-medium text-[#2F2F2F]">
        {doctorName}
      </td>

      <td className="rounded-l-2xl px-6 py-5">
        <div className="flex justify-center">
          <Link to={`/admin/patient/${patient._id}`}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-[#35C759] transition hover:bg-[#EDF8F2]"
          >
            <Eye size={18} />
            <span className="font-medium">معاينة</span>
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default PatientRow;