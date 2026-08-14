import { useEffect, useState } from "react";
import {
  Calendar,
  Globe,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useNavigate ,useParams} from "react-router-dom";
import BackButton from "../components/BackButton";
import patientService from "../../services/patient.service";

const CreatePatientPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const isEdit = !!patientId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Backend field names
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",

    nationalId: "",

    gender: "",

    nationality: "",

    dateOfBirth: "",

    occupation: "",

    maritalStatus: "",

    phone: "",

    alternativePhone: "",

    emergencyContactPhone: "",

    emergencyContactRelation: "",

    email: "",

    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const loadPatient = async () => {
    if (!isEdit) return;

    try {
      setLoading(true);

      const res = await patientService.getPatientById(patientId);

      const patient = res.data.patient;

      setForm({
        firstName: patient.firstName || "",
        middleName: patient.middleName || "",
        lastName: patient.lastName || "",
        nationalId: patient.nationalId || "",
        gender: patient.gender || "",
        nationality: patient.nationality || "",
        dateOfBirth: patient.dateOfBirth
          ? patient.dateOfBirth.split("T")[0]
          : "",
        occupation: patient.occupation || "",
        maritalStatus: patient.maritalStatus || "",
        phone: patient.phone || "",
        alternativePhone: patient.alternativePhone || "",
        emergencyContactPhone:
          patient.emergencyContactPhone || "",
        emergencyContactRelation:
          patient.emergencyContactRelation || "",
        email: patient.email || "",
        address: patient.address || "",
      });
    } catch (err) {
      console.error(err);
      setError("فشل تحميل بيانات المستفيد");
    } finally {
      setLoading(false);
    }
  };

  const savePatient = async (goToReport = false) => {
    try {
      setLoading(true);
      setError("");

      let patient;

      if (isEdit) {
        const res =
          await patientService.updatePatient(
            patientId,
            form
          );

        patient = res.data;
      } else {
        const res =
          await patientService.createPatient(
            form
          );

        patient = res.data;
      }

      alert(
        isEdit
          ? "تم تعديل بيانات المستفيد بنجاح"
          : "تم إنشاء المستفيد بنجاح"
      );

      if (goToReport) {
        navigate(
          `/doctor/reports/beneficiary/${patient._id}`
        );
      } else {
        navigate(
          `/doctor/patient/${patient._id}`
        );
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors?.length) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(
          err.response?.data?.message ||
            (isEdit
              ? "حدث خطأ أثناء تعديل المستفيد"
              : "حدث خطأ أثناء إنشاء المستفيد")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await savePatient(false);
  };

  const handleSaveAndAddReport = async () => {
    await savePatient(true);
  };

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#FCFEFD] px-10 py-10"
    >
      <div className="mx-auto max-w-[1500px]">

<BackButton showHome />

        {/* Title */}

        <div className="mb-14">

          <h1 className="text-5xl font-bold text-[#111827]">
{isEdit ? "تعديل بيانات المستفيد" : "إضافة مستفيد جديد"}          </h1>

          <p className="mt-3 text-lg text-gray-500">
{isEdit
  ? "يمكنك تعديل بيانات المستفيد"
  : "يرجى إدخال البيانات الأساسية للمستفيد"}          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          )}

          {/* ========================= */}
          {/* Personal Information */}
          {/* ========================= */}

          <div className="mb-16">

            <div className="mb-8 flex items-center gap-3">

              <div className="rounded-xl bg-[#4FA0B7]/30 p-3">
                <User
                  size={24}
                  className="text-[#4FA0B7]"
                />
              </div>

              <h2 className="text-3xl font-bold">
                المعلومات الشخصية
              </h2>

            </div>

            <div className="grid grid-cols-3 gap-6">

              {/* First Name */}

              <div>

                <label className="mb-2 block font-medium">
                  الاسم الأول
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="الاسم الأول"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Middle Name */}

              <div>

                <label className="mb-2 block font-medium">
                  الاسم الثاني
                </label>

                <input
                  type="text"
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                  placeholder="الاسم الثاني"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Last Name */}

              <div>

                <label className="mb-2 block font-medium">
                  اسم العائلة
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="اسم العائلة"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* National ID */}

              <div>

                <label className="mb-2 block font-medium">
                  رقم الهوية
                </label>

                <input
                  type="text"
                  name="nationalId"
                  value={form.nationalId}
                  onChange={handleChange}
                  placeholder="12345678901234"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Gender */}

              <div>

                <label className="mb-2 block font-medium">
                  الجنس
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                >
                  <option value="">
                    اختر
                  </option>

                  <option value="male">
                    ذكر
                  </option>

                  <option value="female">
                    أنثى
                  </option>

                </select>

              </div>

              {/* Nationality */}

              <div>

                <label className="mb-2 block font-medium">
                  الجنسية
                </label>

                <div className="relative">

                  <Globe
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="nationality"
                    value={form.nationality}
                    onChange={handleChange}
                    placeholder="الجنسية"
                    className="
                      h-14
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      pr-4
                      pl-12
                      outline-none
                      focus:border-[#4FA0B7]
                    "
                  />

                </div>

              </div>

              {/* Date Of Birth */}

              <div>

                <label className="mb-2 block font-medium">
                  تاريخ الميلاد
                </label>

                <div className="relative">

                  <Calendar
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className="
                      h-14
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      pr-4
                      pl-12
                      outline-none
                      focus:border-[#4FA0B7]
                    "
                  />

                </div>

              </div>

              {/* Occupation */}

              <div>

                <label className="mb-2 block font-medium">
                  المهنة
                </label>

                <input
                  type="text"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  placeholder="المهنة"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Marital Status */}

              <div>

                <label className="mb-2 block font-medium">
                  الحالة الاجتماعية
                </label>

                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                >
                  <option value="">
                    اختر
                  </option>

                  <option value="single">
                    أعزب
                  </option>

                  <option value="married">
                    متزوج
                  </option>

                  <option value="divorced">
                    مطلق
                  </option>

                  <option value="widowed">
                    أرمل
                  </option>

                </select>

              </div>

            </div>

          </div>
                    {/* ========================= */}
          {/* Contact Information */}
          {/* ========================= */}

          <div className="mb-16">

            <div className="mb-8 flex items-center gap-3">

              <div className="rounded-xl bg-[#4FA0B7]/30 p-3">
                <Phone
                  size={24}
                  className="text-[#4FA0B7]"
                />
              </div>

              <h2 className="text-3xl font-bold">
                معلومات التواصل
              </h2>

            </div>

            <div className="grid grid-cols-3 gap-6">

              {/* Phone */}

              <div>

                <label className="mb-2 block font-medium">
                  رقم الهاتف
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01000000000"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Alternative Phone */}

              <div>

                <label className="mb-2 block font-medium">
                  رقم هاتف بديل
                </label>

                <input
                  type="tel"
                  name="alternativePhone"
                  value={form.alternativePhone}
                  onChange={handleChange}
                  placeholder="01000000001"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Emergency Contact Phone */}

              <div>

                <label className="mb-2 block font-medium">
                  رقم هاتف الطوارئ
                </label>

                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="01000000002"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Address */}

              <div className="col-span-3">

                <label className="mb-2 block font-medium">
                  العنوان
                </label>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="المدينه - السعوديه"
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                />

              </div>

              {/* Emergency Contact Relation */}

              <div>

                <label className="mb-2 block font-medium">
                  صلة القرابة
                </label>

                <select
                  name="emergencyContactRelation"
                  value={form.emergencyContactRelation}
                  onChange={handleChange}
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    text-right
                    outline-none
                    focus:border-[#4FA0B7]
                  "
                >
                  <option value="">
                    اختر
                  </option>

                  <option value="Father">
                    الأب
                  </option>

                  <option value="Mother">
                    الأم
                  </option>

                  <option value="Brother">
                    الأخ
                  </option>

                  <option value="Sister">
                    الأخت
                  </option>

                  <option value="Husband">
                    الزوج
                  </option>

                  <option value="Wife">
                    الزوجة
                  </option>

                  <option value="Relative">
                    قريب
                  </option>

                  <option value="Friend">
                    صديق
                  </option>

                </select>

              </div>

              {/* Email */}

              <div className="col-span-2">

                <label className="mb-2 block font-medium">
                  البريد الإلكتروني
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
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
                    "
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ========================= */}
          {/* Buttons */}
          {/* ========================= */}

<div className="mt-16 flex items-center justify-center gap-4">

  <button
    type="submit"
    disabled={loading}
    className="
      rounded-xl
      bg-[#4FA0B7]
      px-8
      py-4
      text-lg
      font-semibold
      text-white
      transition
      hover:bg-[#4FA0B7]/60
      disabled:cursor-not-allowed
      disabled:opacity-60
    "
  >
    {loading ? "جاري الحفظ..." : "حفظ المعلومات"}
  </button>

  {!isEdit && (
    <button
      type="button"
      disabled={loading}
      onClick={handleSaveAndAddReport}
      className="
        rounded-xl
        border
        border-[#4FA0B7]
        px-8
        py-4
        text-lg
        font-semibold
        text-[#4FA0B7]
        transition
        hover:bg-[#4FA0B7]/10
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading
        ? "جاري الحفظ..."
        : "حفظ وإضافة تقرير"}
    </button>
  )}

</div>
        </form>

      </div>

    </main>
  );
};

export default CreatePatientPage;