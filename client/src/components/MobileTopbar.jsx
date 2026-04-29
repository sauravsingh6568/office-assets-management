import { Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../data/mockData";
import { clearAuthSession } from "../lib/auth";

function MobileTopbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthSession();
    setOpen(false);
    navigate("/admin-login");
  }

  return (
    <div className="panel mb-6 p-4 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-100 p-3 text-brand-700">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
              Office Hub
            </p>
            <p className="text-sm font-semibold text-ink-900">Admin Panel</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-2xl border border-slate-200 p-3 text-slate-700"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      {open ? (
        <nav className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-ink-900 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
          >
            Sign Out
          </button>
        </nav>
      ) : null}
    </div>
  );
}

export default MobileTopbar;
