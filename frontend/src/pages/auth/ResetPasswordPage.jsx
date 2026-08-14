import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "/logo.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setLoading(true);

      // TODO:
      // await resetPassword(token, form.password);

      navigate("/login");

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
          <img
            src={logo}
            alt="Recovery"
            className="w-40"
          />
        </div>

        <h1 className="text-center text-5xl font-bold">
          إعادة تعيين كلمة المرور
        </h1>

        <p className="mt-3 text-center text-gray-500">
          أدخل كلمة المرور الجديدة.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          <PasswordInput
            label="كلمة المرور الجديدة"
            name="password"
            value={form.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <PasswordInput
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <button
            type="submit"
            disabled={
              loading ||
              !form.password ||
              !form.confirmPassword
            }
            className="
              h-14
              w-full
              rounded-xl
              bg-[#4FA0B7]
              text-white
              text-lg
              font-semibold
            "
          >
            {loading
              ? "جارٍ الحفظ..."
              : "حفظ كلمة المرور"}
          </button>

        </form>

      </div>
    </main>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) => (
  <div>
    <label className="mb-2 block font-medium">
      {label}
    </label>

    <div className="relative">

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      <Lock
        size={20}
        className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="
          h-14
          w-full
          rounded-xl
          border
          border-gray-300
          pr-4
          pl-20
          text-right
          outline-none
          focus:border-[#4FA0B7]
        "
      />

    </div>
  </div>
);

export default ResetPasswordPage;