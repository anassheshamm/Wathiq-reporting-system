import { Search } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
  placeholder = "ابحث...",
}) => {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white pr-11 pl-4 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
};

export default SearchInput;