import { NavLink, useParams } from "react-router-dom";

const navItems = [
  { label: "Submitted Papers", to: "/manage-conference/:id/submitted-papers" },
  // { label: "Committee", to: "/manage-conference/committee" },
  { label: "Track income", to: "/manage-conference/:id/income" },
  { label: "Conference Information", to: "/manage-conference/:id/edit" },
  { label: "Manage Timelines", to: "/manage-conference/:conferenceId/timelines" },
  { label: "Reviewer List", to: "/manage-conference/:conferenceId/reviewers" },
  { label: "Published Papers", to: "/manage-conference/:conferenceId/published-papers" },
  { label: "Manage Call For Papers", to: "/manage-conference/:conferenceId/call-for-paper" },





];

export default function ManageConferenceSidebar() {
  const { id, conferenceId } = useParams();
  const currentId = conferenceId || id; // fallback nếu route dùng :id

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
          {navItems.map((item) => {
            // Thay thế :id hoặc :conferenceId nếu có trong to
            const finalPath = item.to
              .replace(":id", currentId)
              .replace(":conferenceId", currentId);

            return (
              <li key={item.to}>
                <NavLink
                  to={finalPath}
                  className={({ isActive }) =>
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 " +
                    (isActive
                      ? "bg-blue-500 text-white shadow"
                      : "hover:bg-blue-100 text-blue-700")
                  }
                  end
                >
                  {item.label === "Submitted Papers" && <span>📄</span>}
                  {/* {item.label === "Committee" && <span>👥</span>}*/}
                  {item.label === "Conference Information" && <span>✏️</span>}
                  {item.label === "Manage Timelines" && <span>🗓️</span>}
                  {item.label === "Reviewer List" && <span>🧑‍⚖️</span>}
                  {item.label === "Published Papers" && <span>📚</span>}
                  {item.label === "Track income" && <span>💵</span>}
                  {item.label === "Manage Call For Papers" && <span>📢</span>}



                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
