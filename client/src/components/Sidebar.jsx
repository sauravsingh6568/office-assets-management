import { Boxes, ClipboardCheck, LayoutDashboard, PackageCheck, Settings, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../data/mockData";
import { clearAuthSession, getAuthUser } from "../lib/auth";

const icons = {
  Dashboard: LayoutDashboard,
  Employees: Users,
  Products: Boxes,
  "Assign Product": ClipboardCheck,
  "Return Product": PackageCheck,
  "Admin Settings": Settings,
};

function Sidebar() {
  const navigate = useNavigate();
  const user = getAuthUser();

  function handleLogout() {
    clearAuthSession();
    navigate("/admin-login");
  }

  return (
    <aside className="panel hidden w-72 flex-col p-6 lg:flex">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-700">
          Office Hub
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-ink-900">Asset Control Center</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Manage employees, track products, and keep every assignment lifecycle visible.
        </p>
      </div>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => {
          const Icon = icons[item.label];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-ink-900 text-white shadow-lg"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-800"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-brand-900 p-5 text-white">
        <p className="text-sm font-semibold">Admin Workspace</p>
        <p className="mt-2 text-sm text-white/80">{user?.name || "Authenticated admin"}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/60">{user?.role || "ADMIN"}</p>
        <p className="mt-2 text-sm text-white/80">
          Keep procurement, assignments, and returns aligned across your teams.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
