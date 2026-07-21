import { Compass, Heart, History, LogIn, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/sessionStorage";

function PublicLayout() {
  const [open, setOpen] = useState(false);
  const user = getCurrentUser();
  const profileTarget = user?.role === "ADMINISTRADOR" ? "/admin" : user?.role === "PROPIETARIO" ? "/owner" : "/profile";
  const links = [
    { to: "/activities", label: "Explorar" },
    { to: "/favorites", label: "Favoritos", icon: Heart, roles: ["USUARIO"] },
    { to: "/search-history", label: "Historial", icon: History, roles: ["USUARIO"] }
  ].filter((link) => !link.roles || link.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white"><Compass /></span>
            CitySpot
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `text-sm font-semibold ${isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-950"}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to={profileTarget} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold"><User size={17} />{user.name || "Mi perfil"}</Link>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700">Ingresar</Link>
                <Link to="/register" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Registrarse</Link>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <div className="border-t bg-white px-4 py-4 md:hidden">
            {links.map((link) => <Link onClick={() => setOpen(false)} key={link.to} to={link.to} className="block py-2 font-medium text-slate-700">{link.label}</Link>)}
            <Link to={user ? profileTarget : "/login"} className="mt-2 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-white"><LogIn size={17} />{user ? "Mi perfil" : "Iniciar sesion"}</Link>
          </div>
        )}
      </header>
      <Outlet />
      <footer className="mt-16 border-t bg-slate-950 py-10 text-slate-300">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-lg font-bold text-white">CitySpot</p>
          <p className="mt-2 text-sm">Descubre experiencias, lugares y actividades de Ecuador.</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
