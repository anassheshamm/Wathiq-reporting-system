import HeadRow from "./HeadRow";

const HeadsTable = ({ heads = [] }) => {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <table
        dir="rtl"
        className="w-full border-separate border-spacing-y-4"
      >
        <thead>
          <tr className="bg-[#4FA0B7]/30">
            <th className="rounded-r-2xl px-6 py-5 text-right font-semibold">
              الاسم
            </th>

            <th className="px-6 py-5 text-right font-semibold">
              رقم الهوية
            </th>

            <th className="px-6 py-5 text-right font-semibold">
              رقم الهاتف
            </th>

            {/* Removed License Number column */}

            <th className="px-6 py-5 text-right font-semibold">
              البريد الإلكتروني
            </th>

            {/* Removed Department column */}


          </tr>
        </thead>

        <tbody>
          {heads.length === 0 ? (
            <tr>
              <td
                colSpan={5} // Changed colSpan from 7 to 5 due to removed columns
                className="py-16 text-center text-gray-400"
              >
                لا يوجد رؤساء أقسام
              </td>
            </tr>
          ) : (
            heads.map((head, index) => (
              <HeadRow
                key={head._id || index}
                head={head}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HeadsTable;