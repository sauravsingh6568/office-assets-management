import { Bell, Search } from "lucide-react";
import MobileTopbar from "./MobileTopbar";
import Sidebar from "./Sidebar";

function PageLayout({
  title,
  subtitle,
  action,
  children,
  searchValue = "",
  searchPlaceholder = "Search people, products, records...",
  onSearchChange,
  onNotificationsClick,
}) {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <MobileTopbar />

          <section className="panel p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
                  Admin Overview
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-ink-900 sm:text-3xl">{title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end xl:w-auto xl:self-center">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 sm:max-w-sm xl:w-96 xl:max-w-none">
                  <Search size={18} className="shrink-0" />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
                <button
                  type="button"
                  onClick={onNotificationsClick}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </button>
                <div className="sm:shrink-0 sm:self-stretch xl:self-auto">{action}</div>
              </div>
            </div>
          </section>

          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default PageLayout;
