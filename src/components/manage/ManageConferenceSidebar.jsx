import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Submitted Papers", to: "/manage-conference" },
  { label: "Committee", to: "/manage-conference/committee" },
  { label: "Settings", to: "/manage-conference/settings" },
];

export default function ManageConferenceSidebar() {
  return (
    <aside className="w-64 bg-gray-100 border-r p-4">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  "block px-4 py-2 rounded " +
                  (isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-200 text-gray-700")
                }
                end
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}