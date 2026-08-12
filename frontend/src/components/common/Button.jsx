import { Loader2 } from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "lg",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-[#35C759] text-white hover:bg-[#2FB350] active:scale-[0.99]",

    secondary:
      "bg-white text-[#35C759] border border-[#35C759] hover:bg-[#F5FFF8]",

    danger:
      "bg-red-500 text-white hover:bg-red-600",

    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "h-10 px-4 text-sm rounded-xl",

    md: "h-12 px-6 text-base rounded-xl",

    lg: "h-14 px-6 text-lg rounded-2xl",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        flex
        w-full
        items-center
        justify-center
        gap-2
        font-bold
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <Loader2
          size={20}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}