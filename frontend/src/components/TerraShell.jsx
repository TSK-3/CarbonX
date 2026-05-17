import { Bell, CreditCard, FileCheck2, LayoutDashboard, LogOut, MapPinned, Settings, UserCircle, Languages } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export function TerraShell() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useI18n();

  const navItems = [
    { to: "/", label: t("dashboard"), icon: LayoutDashboard },
    { to: "/farms/new", label: t("registerLand"), icon: MapPinned },
    { to: "/verification", label: t("verification"), icon: FileCheck2 },
    { to: "/earnings", label: t("earnings"), icon: CreditCard }
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
    { code: "hi", label: "हिन्दी" }
  ];

  return (
    <div className="terra-page pb-20 md:pb-0">
      <header className="sticky top-0 z-30 h-16 border-b border-outline-variant bg-surface-bright">
        <div className="flex h-full items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-black tracking-[-0.03em] text-primary">
              CarbonX
            </NavLink>
            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                        isActive ? "text-primary" : "text-outline hover:text-primary"
                      }`
                    }
                    key={item.to}
                    to={item.to}
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-2.5 py-1.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Change Language"
              >
                <Languages size={16} />
                <span className="uppercase">{lang}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden w-32 flex-col rounded-lg border border-outline-variant bg-white py-1 shadow-lg group-hover:flex">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className="px-4 py-2 text-left text-sm hover:bg-surface-container"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <button
                aria-label="Notifications"
                className="rounded-full p-2 text-outline hover:bg-surface-container hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                title="Notifications"
            >
              <Bell size={18} />
            </button>

            <button
              aria-label="Settings"
              className="rounded-full p-2 text-outline hover:bg-surface-container hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              title="Settings"
            >
              <Settings size={18} />
            </button>

            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-on-surface">{user?.name || "Farmer"}</p>
              <p className="text-xs text-outline">{user?.phone}</p>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-full border border-outline-variant bg-surface-container text-primary">
              <UserCircle size={20} />
            </div>
            <button
                aria-label="Log out"
                className="rounded-full p-2 text-outline hover:bg-surface-container hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={logout}
                title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-outline-variant bg-white px-4 pb-safe md:hidden">
        {navItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive ? "scale-110 text-primary font-bold" : "text-outline"
                }`
              }
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </NavLink>
          );
        })}
        <NavLink
            to="/profile"
            className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-all ${
                isActive ? "scale-110 text-primary font-bold" : "text-outline"
            }`
            }
        >
            <UserCircle size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t("profile")}</span>
        </NavLink>
      </nav>
    </div>
  );
}
