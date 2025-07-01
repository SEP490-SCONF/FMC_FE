import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Submitted Papers", to: "/manage-conference" },
  { label: "Committee", to: "/manage-conference/committee" },
  { label: "Settings", to: "/manage-conference/settings" },
];

export default function ManageConferenceSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 border-r p-6 shadow-lg flex flex-col">
      <div className="mb-8 flex items-center gap-2">
        <span className="text-blue-600 text-2xl font-bold">🗂️</span>
        <span className="text-xl font-semibold text-blue-700 tracking-wide">
          Manage Conference
        </span>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 " +
                  (isActive
                    ? "bg-blue-500 text-white shadow"
                    : "hover:bg-blue-100 text-blue-700")
                }
                end
              >
                {/* Optional: Add icons for each nav item */}
                {item.label === "Submitted Papers" && <span>📄</span>}
                {item.label === "Committee" && <span>👥</span>}
                {item.label === "Settings" && <span>⚙️</span>}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}