export default function SectionHeader({
    title,
    icon,
    align = "start",
}) {
    return (
        <div
            className={`
                mb-10
                flex
                w-full
                items-center
                gap-4

                ${align === "center" ? "justify-center" : ""}

                ${align === "end" ? "justify-end" : ""}
            `}
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF8EE] text-[#38C85A]">
                {icon}
            </div>

            <h2 className="text-3xl font-extrabold text-[#17223B]">
                {title}
            </h2>
        </div>
    );
}