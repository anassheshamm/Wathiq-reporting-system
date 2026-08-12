// import { useState } from "react";
// import { Plus, Search } from "lucide-react";

// const PatientStats = () => {
//   const [search, setSearch] = useState("");

//   return (
//     <div className="rounded-[28px] border border-[#E8F2EC] bg-white p-6 shadow-sm">

//       {/* Create Patient */}

//       <button
//         className="
//           mb-6
//           flex
//           h-14
//           w-full
//           items-center
//           justify-center
//           gap-2
//           rounded-2xl
//           bg-[#35C759]
//           text-lg
//           font-semibold
//           text-white
//           transition
//           hover:bg-[#2FB350]
//         "
//       >
//         <Plus size={22} />

//         <span>إنشاء ملف مستفيد جديد</span>
//       </button>

//       {/* Search */}

//       <div className="relative mb-6">

//         <Search
//           size={20}
//           className="
//             absolute
//             right-4
//             top-1/2
//             -translate-y-1/2
//             text-gray-400
//           "
//         />

//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="ابحث بالاسم أو رقم الهوية"
//           className="
//             h-12
//             w-full
//             rounded-xl
//             bg-[#F4F7F5]
//             pr-12
//             pl-4
//             text-right
//             outline-none
//             placeholder:text-gray-500
//             focus:ring-2
//             focus:ring-[#247C5A]/10
//           "
//         />

//       </div>

//       {/* Fill Report */}

//       <button
//         className="
//           mb-8
//           flex
//           h-12
//           w-full
//           items-center
//           justify-center
//           gap-2
//           rounded-xl
//           border
//           border-[#35C759]
//           text-[#247C5A]
//           font-semibold
//           transition
//           hover:bg-[#EDF8F2]
//         "
//       >
//         <Plus size={18} />

//         <span>ملء تقرير جديد</span>
//       </button>

//       {/* Stats */}

//       <div className="space-y-5 text-base">

//         <div className="flex items-center justify-between">
//           <span>عدد المستفيدين</span>
//           <span className="font-bold">1</span>
//         </div>

//         <div className="flex items-center justify-between">
//           <span>عدد التقارير</span>
//           <span className="font-bold">2</span>
//         </div>

//         <div className="flex items-center justify-between">
//           <span>تقارير غير مكتملة</span>
//           <span className="font-bold">0</span>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default PatientStats;