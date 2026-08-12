import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import logo from "/logo2.png";
import logo2 from "/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) return;

    try {
      setLoading(true);
      setError("");

      const user = await login({
        email: form.email,
        password: form.password,
      });

   // 1. Add this console log to see exactly what string your DB is sending back
      console.log("User role from DB is:", user.role);

      switch (user.role) {
        case "admin":
          navigate("/admin/heads");
          break;
        case "doctor":
          navigate("/doctor");
          break;
        case "teamLeader":
        case "team_leader": // 2. Add this fallback to catch older database entries!
          navigate("/team-leader");
          break;
        default:
          console.warn("Unrecognized role. Check your database!", user.role);
          navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "فشل تسجيل الدخول"
      );
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

        {/* Logo */}

        <div className="mb-10 flex justify-center">
          <img
            src={logo}
            alt="Recovery"
            className="w-40 object-contain"
          />
          <img
            src={logo2}
            alt="Recovery"
            className="w-40 object-contain"
          />
        </div>

        {/* Title */}

        <h1 className="text-center text-5xl font-bold text-[#111827]">
          تسجيل الدخول
        </h1>

        <p className="mt-3 text-center text-lg text-gray-500">
          الرجاء تسجيل البيانات للمتابعة
        </p>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
        >

          {/* Email */}

          <div>
            <label className="mb-2 block text-lg font-medium text-[#1F2937]">
              البريد الإلكتروني
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="
                  h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  pr-4
                  pl-12
                  text-right
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#35C759]
                  focus:ring-2
                  focus:ring-[#35C759]/10
                "
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-lg font-medium text-[#1F2937]">
              كلمة المرور
            </label>

            <div className="relative">

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

              <Lock
                size={20}
                className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="
                  h-14
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  pr-4
                  pl-20
                  text-right
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#35C759]
                  focus:ring-2
                  focus:ring-[#35C759]/10
                "
              />
            </div>
          </div>

          {/* Remember + Forgot */}

          <div className="flex items-center justify-between">

            <Link
              to="/forgot-password"
              className="
                text-sm
                font-medium
                text-[#247C5A]
                transition
                hover:underline
              "
            >
              نسيت كلمة المرور؟
            </Link>

            

          </div>

          {/* Error Message */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Button */}

          <button
            type="submit"
            disabled={
              loading ||
              !form.email ||
              !form.password
            }
            className="
              mt-2
              h-14
              w-full
              rounded-xl
              bg-[#35C759]
              text-lg
              font-semibold
              text-white
              transition
              hover:bg-[#2FB350]
              disabled:cursor-not-allowed
              disabled:bg-gray-300
            "
          >
            {loading
              ? "جاري تسجيل الدخول..."
              : "تسجيل الدخول"}
          </button>

        </form>

      </div>
    </main>
  );
};

export default LoginPage;