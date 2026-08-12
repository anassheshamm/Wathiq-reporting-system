import { Download } from "lucide-react";

const HeadsHeader = ({ onDownload }) => {
  return (
    <>
      <div className="mb-3 text-sm text-gray-400">
        الرئيسية / رؤساء الأقسام
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-bold text-[#1F2937]">
            لائحة رؤساء الأقسام
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            عرض وإدارة جميع ملفات رؤساء الأقسام بالمركز
          </p>
        </div>

        <button
          onClick={onDownload}
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[#247C5A] px-6 py-3 text-white transition hover:bg-[#1F6D4E]"
        >
          <Download size={18} />
          تنزيل اللائحة
        </button>
        
      </div>

      <div className="mt-8 h-px bg-[#E5EFE9]" />
    </>
  );
};

export default HeadsHeader;