import { Compass, LayoutDashboard, MapPinned, Menu, Tags, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logout } from "../../features/auth/services/authService";
import { getCurrentUser } from "../../services/sessionStorage";
import ProfileActionsMenu from "../ui/ProfileActionsMenu";

const navItems = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/admin/categories", label: "Categorías", icon: Tags },
  { to: "/admin/activities", label: "Actividades", icon: MapPinned }
];

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    const clearAdminSessionOnHistoryNavigation = () => {
      logout();
    };

    window.addEventListener("popstate", clearAdminSessionOnHistoryNavigation);

    return () => {
      window.removeEventListener("popstate", clearAdminSessionOnHistoryNavigation);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2 shadow lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-xl font-black text-slate-950">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                <Compass />
              </span>
              CitySpot
            </Link>
            <button
              type="button"
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Panel administrativo</p>
            <p className="mt-1 truncate font-semibold text-slate-950">{user?.name}</p>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
          <ProfileActionsMenu />
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
