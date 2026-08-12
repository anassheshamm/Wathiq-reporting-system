import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Phone,
  UserRound,
  Lock,
  CreditCard,
  Users,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


import Logo from "../../components/auth/Logo";
import SectionHeader from "../../components/auth/SectionHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

// Import your auth service (adjust the path if necessary)
import authService from "../../services/auth.service";

const schema = z
  .object({
    firstName: z.string().min(2, "الاسم الأول مطلوب"),
    middleName: z.string().min(2, "الاسم الأوسط مطلوب"),
    lastName: z.string().min(2, "اسم العائلة مطلوب"),
    nationalId: z.string().length(14, "رقم الهوية يجب أن يكون 14 رقماً"),
    phone: z.string().min(11, "رقم الهاتف غير صحيح"),
    email: z.string().email("بريد إلكتروني غير صحيح"),
    gender: z.enum(["male", "female"], { errorMap: () => ({ message: "اختر الجنس" }) }),
    password: z.string().min(8, "٨ أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمتا المرور غير متطابقتين",
  });

export default function Register() {
  const navigate = useNavigate();
  // Get the invitation token from the URL e.g., /register?token=xyz...
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      setApiError("رابط التسجيل غير صالح أو مفقود. يجب استخدام رابط الدعوة.");
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      // Combine form data with the token required by backend validation
      const payload = {
        token,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        nationalId: data.nationalId,
        phone: data.phone,
        email: data.email, // Kept in case backend requires confirmation
        gender: data.gender,
        password: data.password,
      };

      await authService.register(payload);
      
      // On success, redirect to login page
      navigate("/login", { 
        state: { message: "تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول." } 
      });

    } catch (err) {
      // Handle error message from backend
      setApiError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.msg || 
        "حدث خطأ أثناء محاولة إنشاء الحساب."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF] py-10" dir="rtl">
      <div className="mx-auto max-w-7xl px-8">

        <Logo />
      

        <div className="mb-14 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900">
            إنشاء حساب جديد
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            الرجاء إكمال البيانات للمتابعة
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-4xl space-y-14"
        >

          {/* Error Banner */}
          {apiError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600">
              {apiError}
            </div>
          )}

          {/* Personal Definition */}
          <section>
            <SectionHeader
              title="التعريف الشخصي"
              icon={<CreditCard size={22} />}
            />

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-3">
              
              <Input
                label="الاسم الأول"
                placeholder="ادخل اسمك"
                icon={<UserRound size={18} />}
                error={errors.firstName?.message}
                {...register("firstName")}
              />

              <Input
                label="الاسم الأوسط"
                placeholder="ادخل الاسم الأوسط"
                icon={<UserRound size={18} />}
                error={errors.middleName?.message}
                {...register("middleName")}
              />

              <Input
                label="اسم العائلة"
                placeholder="ادخل اسم العائلة"
                icon={<UserRound size={18} />}
                error={errors.lastName?.message}
                {...register("lastName")}
              />

              <div className="md:col-span-2">
                <Input
                  label="رقم الهوية"
                  placeholder="ادخل رقم الهوية (14 رقم)"
                  icon={<CreditCard size={18} />}
                  error={errors.nationalId?.message}
                  {...register("nationalId")}
                />
              </div>

              <Select
                label="الجنس"
                icon={<Users size={18} />}
                options={[
                  { label: "ذكر", value: "male" },
                  { label: "أنثى", value: "female" }
                ]}
                error={errors.gender?.message}
                {...register("gender")}
              />

            </div>
          </section>

          {/* Contact Information */}
          <section>
            <SectionHeader
              title="معلومات التواصل"
              icon={<Mail size={22} />}
            />

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
              <Input
                label="رقم الهاتف"
                placeholder="01000000000"
                icon={<Phone size={18} />}
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="البريد الإلكتروني"
                placeholder="your.email@example.com"
                icon={<Mail size={18} />}
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
          </section>

          {/* Password */}
          <section>
            <SectionHeader
              title="تعيين الرقم السري"
              icon={<Lock size={22} />}
            />

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
              <PasswordInput
                label="الرقم السري"
                error={errors.password?.message}
                {...register("password")}
              />

              <PasswordInput
                label="اعادة ادخال الرقم السري"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>
          </section>

          <div className="pt-2 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full md:w-1/2 rounded-2xl text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            </Button>
          </div>

        </form>
      </div>
    </main>
  );
}