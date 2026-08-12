// frontend/src/features/components/InviteMemberModal.jsx
import { useState } from "react";
import { X, Loader2, Copy, CheckCircle, MailCheck } from "lucide-react";
import api from "../../services/api";
import Swal from "sweetalert2";

const InviteMemberModal = ({ open, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !role) return;

    try {
      setSubmitting(true);
      setError("");
      
      const response = await api.post("/invitations", { email, role });

      if (response.data?.success || response.status === 200 || response.status === 201) {
        const link = response.data?.data?.registrationLink;
        
        if (link) {
          setGeneratedLink(link);
          if (onSuccess) onSuccess(); 
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ أثناء إرسال الدعوة. تأكد من صحة البريد الإلكتروني."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (submitting) return;
    setEmail("");
    setRole("");
    setError("");
    setGeneratedLink("");
    setCopied(false);
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-5">
          <h2 className="text-xl font-bold text-[#1F2937]">
            {generatedLink ? "تم إرسال الدعوة بنجاح" : "دعوة عضو جديد"}
          </h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {generatedLink ? (
          /* Success State */
          <div className="space-y-6 p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-[#35C759]">
              <MailCheck size={32} />
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                تم إرسال البريد الإلكتروني!
              </h3>
              <p className="mb-6 text-sm font-medium text-gray-500 leading-relaxed">
                تم إرسال رابط التسجيل إلى <span className="text-[#35C759]" dir="ltr">{email}</span>.
                يمكنك أيضاً نسخ الرابط أدناه وإرساله يدوياً في حال لم يصل البريد.
              </p>
              
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  dir="ltr"
                  className="w-full bg-transparent px-2 text-sm text-gray-600 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition ${
                    copied ? "bg-green-500" : "bg-[#35C759] hover:bg-[#2FB350]"
                  }`}
                >
                  {copied ? "تم النسخ!" : <Copy size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full rounded-xl border border-gray-300 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              إغلاق
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 text-right outline-none transition focus:border-[#35C759] focus:ring-2 focus:ring-[#35C759]/20 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                نوع الحساب
              </label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting}
                className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-right outline-none transition focus:border-[#35C759] focus:ring-2 focus:ring-[#35C759]/20 disabled:bg-gray-100"
              >
                <option value="">اختر نوع الحساب</option>
                <option value="doctor">مرشد تعافي / معالج</option>
                <option value="teamLeader">رئيس فريق</option>
                <option value="admin">مسؤول نظام (مدير)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={!email || !role || submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#35C759] py-3 font-bold text-white shadow-sm transition hover:bg-[#2FB350] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  "إرسال الدعوة"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteMemberModal;