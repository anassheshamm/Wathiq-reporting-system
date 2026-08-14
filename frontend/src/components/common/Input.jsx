import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      icon,
      error,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        {label && (
          <label className="text-[18px] font-semibold text-slate-800">
            {label}
          </label>
        )}

        <div className="relative">

          <input
            ref={ref}
            dir="rtl"
            className={`
              h-14
              w-full
              rounded-2xl
              border
              border-[#D7E3F4]
              bg-white
              pr-14
              pl-4
              text-base
              text-slate-800
              placeholder:text-slate-400
              transition-all
              duration-200
              outline-none
              focus:border-[#4FA0B7]
              focus:ring-4
              focus:ring-[#4FA0B7]/10
              ${className}
            `}
            {...props}
          />

          {icon && (
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
              {icon}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;