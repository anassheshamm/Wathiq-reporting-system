import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import logo from "/logo.png";
import logo2 from "/logo2.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);

      // TODO:
      // await forgotPassword(email);

      setSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-white px-6"
    >
      <div className="w-full max-w-md">
<div className="mb-10 flex justify-center">
        <div className="mb-10 flex justify-center">
          <img
            src={logo}
            alt="Recovery"
            className="w-40"
          />
        </div>
         <div className="mb-10 flex justify-center">
          <img
            src={logo2}
            alt="Recovery"
            className="w-40"
          />
        </div>
        </div>

        <h1 className="text-center text-5xl font-bold text-[#111827]">
          نسيت كلمة المرور
        </h1>

        <p className="mt-3 text-center text-gray-500">
          أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.
        </p>

        {sent ? (
          <div className="mt-10 rounded-xl bg-green-50 p-5 text-center text-[#4FA0B7]">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            <div>
              <label className="mb-2 block font-medium">
                البريد الإلكتروني
              </label>

              <div className="relative">

                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    pr-4
                    pl-12
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                    focus:ring-2
                    focus:ring-[#4FA0B7]/10
                  "
                />

              </div>
            </div>

            <button
              type="submit"
              disabled={!email || loading}
              className="
                h-14
                w-full
                rounded-xl
                bg-[#4FA0B7]
                text-lg
                font-semibold
                text-white
                transition
                hover:bg-[#4FA0B7]/60
                disabled:bg-gray-300
              "
            >
              {loading
                ? "جارٍ الإرسال..."
                : "إرسال الرابط"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="font-medium text-[#4FA0B7] hover:underline"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>

      </div>
    </main>
  );
};

export default ForgotPasswordPage;