import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, active, onClick }) => {
  // If item has a router path, render as NavLink
  if (item?.path) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `
            flex w-full items-center justify-center rounded-2xl py-3.5 text-base font-medium transition-all duration-200

            ${
              isActive
                ? "bg-[#4FA0B7] text-white shadow-sm"
                : "bg-[#A9D3DF] text-gray-700 hover:bg-[#E6AB7B9]/30"
            }
          `
        }
      >
        {item.label}
      </NavLink>
    );
  }

  // Fallback button for custom onClick handling
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full rounded-2xl py-3.5 text-base font-medium transition-all duration-200

        ${
          active
            ? "bg-[rgb(106,183,185)] text-white shadow-sm"
            : "bg-[#6AB7B9] text-gray-700 hover:bg-[#6AB7B9]/30"
        }
      `}
    >
      {item.label}
    </button>
  );
};

export default SidebarItem;