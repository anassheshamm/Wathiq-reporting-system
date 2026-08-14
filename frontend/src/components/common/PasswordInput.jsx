import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = forwardRef(
  (
    {
      label,
      error,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        {label && (
          <label className="text-[18px] font-semibold text-slate-800">
            {label}
          </label>
        )}

        <div className="relative">

          {/* Lock Icon */}

          <div
            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
              text-slate-400
              pointer-events-none
            "
          >
            <Lock size={18} />
          </div>

          {/* Input */}

          <input
            ref={ref}
            dir="rtl"
            type={showPassword ? "text" : "password"}
            className={`
              h-14
              w-full
              rounded-2xl
              border
              border-[#D7E3F4]
              bg-white
              pr-14
              pl-14
              text-base
              text-slate-800
              placeholder:text-slate-400
              outline-none
              transition-all
              duration-200
              focus:border-[#4FA0B7]
              focus:ring-4
              focus:ring-[#4FA0B7]/10
              ${className}
            `}
            {...props}
          />

          {/* Show / Hide */}

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition
              hover:text-[#35C759]
            "
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {error && (
          <span className="text-sm text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;