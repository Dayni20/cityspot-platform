import { LogOut, LayoutDashboard, Tags, MapPinned, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/services/authService";
import { getCurrentUser } from "../../services/sessionStorage";

const navItems = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/admin/categories", label: "Categorías", icon: Tags },
  { to: "/admin/activities", label: "Actividades", icon: MapPinned }
];

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-md bg-white p-2 shadow lg:hidden"
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
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-lg font-semibold text-slate-950">CitySpot</p>
              <p className="text-sm text-slate-500">Administrador</p>
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
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

          <div className="border-t border-slate-200 p-4">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
