import { forwardRef } from "react";

const Select = forwardRef(({ label, icon, options = [], error, className = "", ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      {/* Select Wrapper */}
      <div className="relative">
        <select
          ref={ref}
          className={`
            h-12 w-full appearance-none rounded-xl border bg-white px-4 text-right outline-none transition
            ${icon ? "pr-10" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-gray-300 focus:border-[#35C759] focus:ring-[#35C759]/10"
            }
            focus:ring-2
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>اختر...</option>
          
          {/* Options Mapping */}
          {options.map((option, index) => {
            // Check if the option is an object {label, value} or just a normal string
            const isObject = typeof option === "object" && option !== null;
            const value = isObject ? option.value : option;
            const label = isObject ? option.label : option;

            return (
              <option key={value || index} value={value}>
                {label}
              </option>
            );
          })}
        </select>

        {/* Icon */}
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  );
});

Select.displayName = "Select";
export default Select;