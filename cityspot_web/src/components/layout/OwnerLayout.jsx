import { Compass, LayoutDashboard, MapPinned, Menu, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { clearSession, getCurrentUser } from "../../services/sessionStorage";

const links = [
  { to: "/owner", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "/owner/activities", label: "Mis actividades", icon: MapPinned },
  { to: "/owner/activities/new", label: "Nueva actividad", icon: PlusCircle }
];

function OwnerLayout() {
  const [open, setOpen] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    const clearOwnerSessionOnHistoryNavigation = () => {
      clearSession();
    };

    window.addEventListener("popstate", clearOwnerSessionOnHistoryNavigation);

    return () => {
      window.removeEventListener("popstate", clearOwnerSessionOnHistoryNavigation);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <button
        className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2 shadow lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-5">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 text-xl font-black">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                <Compass />
              </span>
              CitySpot
            </Link>
            <button className="lg:hidden" onClick={() => setOpen(false)} type="button">
              <X />
            </button>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Panel propietario</p>
            <p className="mt-1 truncate font-semibold">{user?.name}</p>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  end={link.end}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                      isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default OwnerLayout;
