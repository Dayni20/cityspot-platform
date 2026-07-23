import { Compass, Heart, History, LayoutDashboard, LogIn, LogOut, Menu, MessageCircleQuestion, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearSession, getCurrentUser } from "../../services/sessionStorage";
import { inquiryService } from "../../features/inquiries/services/inquiryService";

function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [unreadInquiryCount, setUnreadInquiryCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isProfilePage = location.pathname === "/profile";
  const links = [
    { to: "/activities", label: "Explorar", roles: ["USUARIO"] },
    { to: "/favorites", label: "Favoritos", icon: Heart, roles: ["USUARIO"] },
    { to: "/search-history", label: "Historial", icon: History, roles: ["USUARIO"] },
    { to: "/consultas", label: "Consultas", icon: MessageCircleQuestion, roles: ["USUARIO"] }
  ].filter((link) => !link.roles || link.roles.includes(user?.role));

  const handleLogout = () => {
    clearSession();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (user?.role !== "USUARIO") return undefined;

    const clearUserSessionOnHistoryNavigation = () => {
      clearSession();
    };

    window.addEventListener("popstate", clearUserSessionOnHistoryNavigation);

    return () => {
      window.removeEventListener("popstate", clearUserSessionOnHistoryNavigation);
    };
  }, [user?.role]);

  useEffect(() => {
    if (user?.role !== "USUARIO") return;

    inquiryService.unreadCount()
      .then((response) => setUnreadInquiryCount(Number(response.unreadCount) || 0))
      .catch(() => setUnreadInquiryCount(0));
  }, [user?.role, location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {isProfilePage ? (
            <div className="flex items-center gap-2 text-xl font-black text-slate-950">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white"><Compass /></span>
              CitySpot
            </div>
          ) : (
            <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white"><Compass /></span>
              CitySpot
            </Link>
          )}
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `relative text-sm font-semibold ${isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-950"}`}>
                {link.label}
                {link.to === "/consultas" && unreadInquiryCount > 0 && (
                  <span className="absolute -right-4 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-none text-white">
                    {unreadInquiryCount > 99 ? "99+" : unreadInquiryCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {user.role === "ADMINISTRADOR" && (
                  <Link to="/admin" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"><LayoutDashboard size={17} />Menú administrativo</Link>
                )}
                {user.role === "PROPIETARIO" && (
                  <Link to="/owner" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"><LayoutDashboard size={17} />Menú propietario</Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold"><User size={17} />Mi perfil</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" type="button"><LogOut size={17} />Cerrar sesión</button>
              </>
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
            {links.map((link) => (
              <Link onClick={() => setOpen(false)} key={link.to} to={link.to} className="flex items-center justify-between py-2 font-medium text-slate-700">
                <span>{link.label}</span>
                {link.to === "/consultas" && unreadInquiryCount > 0 && (
                  <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-none text-white">
                    {unreadInquiryCount > 99 ? "99+" : unreadInquiryCount}
                  </span>
                )}
              </Link>
            ))}
            {user?.role === "ADMINISTRADOR" && <Link onClick={() => setOpen(false)} to="/admin" className="mt-2 flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold text-slate-700"><LayoutDashboard size={17} />Menú administrativo</Link>}
            {user?.role === "PROPIETARIO" && <Link onClick={() => setOpen(false)} to="/owner" className="mt-2 flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold text-slate-700"><LayoutDashboard size={17} />Menú propietario</Link>}
            <Link onClick={() => setOpen(false)} to={user ? "/profile" : "/login"} className="mt-2 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-white"><LogIn size={17} />{user ? "Mi perfil" : "Iniciar sesion"}</Link>
            {user && <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-xl border px-4 py-2 font-semibold text-slate-700" type="button"><LogOut size={17} />Cerrar sesión</button>}
          </div>
        )}
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="mt-auto border-t bg-slate-950 py-10 text-slate-300">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-lg font-bold text-white">CitySpot</p>
          <p className="mt-2 text-sm">Descubre experiencias, lugares y actividades de Ecuador.</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
