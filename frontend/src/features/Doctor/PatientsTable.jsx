import { useState, useEffect } from "react";
import PatientRow from "./PatientRow";

const PatientsTable = ({ patients: initialPatients = [] }) => {
  const [patients, setPatients] = useState(initialPatients);

  useEffect(() => {
    setPatients(initialPatients);
  }, [initialPatients]);

  const handleDeleteSuccess = (deletedId) => {
    setPatients((prevPatients) =>
      prevPatients.filter((patient) => patient._id !== deletedId)
    );
  };


  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <table dir="rtl" className="w-full border-separate border-spacing-y-4">
        <thead>
          <tr className="bg-[#4FA0B7]/30 text-[#2F2F2F]">
            <th className="rounded-r-2xl px-6 py-5 text-right font-semibold">
              الاسم
            </th>
            <th className="px-6 py-5 text-right font-semibold">
              السن
            </th>
            <th className="px-6 py-5 text-right font-semibold">
              رقم الهوية
            </th>
            <th className="px-6 py-5 text-right font-semibold">
              رقم الهاتف
            </th>
            <th className="px-6 py-5 text-right font-semibold">
              تاريخ الانضمام
            </th>
            <th className="px-6 py-5 text-right font-semibold">
              البريد الإلكتروني
            </th>
            <th className="rounded-l-2xl px-6 py-5 text-center font-semibold">
              الإجراءات
            </th>
          </tr>
        </thead>

        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 text-center text-gray-400">
                لا يوجد مستفيدون
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <PatientRow
                key={patient._id}
                patient={patient}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsTable;