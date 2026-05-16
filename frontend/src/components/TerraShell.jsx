import { Bell, CreditCard, FileCheck2, LayoutDashboard, LogOut, MapPinned, Settings, UserCircle } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/farms/new", label: "Register Land", icon: MapPinned },
  { to: "/verification", label: "Verification", icon: FileCheck2 },
  { to: "/earnings", label: "Earnings", icon: CreditCard }
];

export function TerraShell() {
  const { user, logout } = useAuth();

  return (
    <div className="terra-page">
      <header className="sticky top-0 z-30 h-16 border-b border-stone-200 bg-[#fdfcfb]">
        <div className="flex h-full items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-black tracking-[-0.03em] text-primary-container">
              CarbonX
            </NavLink>
            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                        isActive ? "text-field" : "text-outline hover:text-field"
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
            <button className="rounded-full p-2 text-outline hover:bg-surface-low hover:text-field" title="Notifications">
              <Bell size={18} />
            </button>
            <button className="rounded-full p-2 text-outline hover:bg-surface-low hover:text-field" title="Settings">
              <Settings size={18} />
            </button>
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-field">{user?.name || "Farmer"}</p>
              <p className="text-xs text-outline">{user?.phone}</p>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-full border border-outline-variant bg-surface-container text-field">
              <UserCircle size={20} />
            </div>
            <button className="rounded-full p-2 text-outline hover:bg-surface-low hover:text-field" onClick={logout} title="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
