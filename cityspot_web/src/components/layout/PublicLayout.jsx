import {
  ChevronDown,
  Compass,
  Heart,
  History,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageCircleQuestion,
  Settings,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { inquiryService } from "../../features/inquiries/services/inquiryService";
import { profileService } from "../../features/profile/services/profileService";
import { clearSession, getCurrentUser } from "../../services/sessionStorage";

function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false);
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

  const closeMenus = () => {
    setOpen(false);
    setProfileMenuOpen(false);
    setConfirmDeactivateOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    closeMenus();
    navigate("/login", { replace: true });
  };

  const deactivateAccount = async () => {
    try {
      await profileService.deactivate();
      clearSession();
      closeMenus();
      navigate("/login", { replace: true, state: { message: "Cuenta desactivada correctamente." } });
    } catch {
      closeMenus();
      navigate("/profile?section=account", { replace: true });
    }
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

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {isProfilePage ? (
            <div className="flex items-center gap-2 text-xl font-black text-slate-950">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                <Compass />
              </span>
              CitySpot
            </div>
          ) : (
            <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                <Compass />
              </span>
              CitySpot
            </Link>
          )}

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm font-semibold ${
                    isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-950"
                  }`
                }
              >
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
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <LayoutDashboard size={17} />
                    Menu administrativo
                  </Link>
                )}
                {user.role === "PROPIETARIO" && (
                  <Link
                    to="/owner"
                    className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <LayoutDashboard size={17} />
                    Menu propietario
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen((current) => !current)}
                    className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    type="button"
                  >
                    <User size={17} />
                    Mi perfil
                    <ChevronDown size={16} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                      <div className="border-b border-slate-100 px-2 pb-3">
                        <p className="truncate font-bold text-slate-950">{user.name || "Usuario"}</p>
                        <p className="truncate text-sm text-slate-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <ProfileMenuLink to="/profile?section=profile" icon={User} onClick={closeMenus}>
                          Actualizar perfil
                        </ProfileMenuLink>
                        <ProfileMenuLink to="/profile?section=password" icon={KeyRound} onClick={closeMenus}>
                          Cambiar contrasena
                        </ProfileMenuLink>
                        {user.role !== "ADMINISTRADOR" && (
                          <button
                            type="button"
                            onClick={() => setConfirmDeactivateOpen((current) => !current)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                          >
                            <Settings size={17} />
                            Desactivar cuenta
                          </button>
                        )}
                      </div>
                      {confirmDeactivateOpen && (
                        <div className="mb-2 rounded-xl border border-red-100 bg-red-50 p-3">
                          <p className="text-sm font-semibold text-red-700">Seguro quieres desactivar tu cuenta?</p>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={deactivateAccount}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
                            >
                              Si
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeactivateOpen(false)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50"
                          type="button"
                        >
                          <LogOut size={17} />
                          Cerrar sesion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700">
                  Ingresar
                </Link>
                <Link to="/register" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)} type="button">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="border-t bg-white px-4 py-4 md:hidden">
            {links.map((link) => (
              <Link
                onClick={() => setOpen(false)}
                key={link.to}
                to={link.to}
                className="flex items-center justify-between py-2 font-medium text-slate-700"
              >
                <span>{link.label}</span>
                {link.to === "/consultas" && unreadInquiryCount > 0 && (
                  <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-none text-white">
                    {unreadInquiryCount > 99 ? "99+" : unreadInquiryCount}
                  </span>
                )}
              </Link>
            ))}

            {user?.role === "ADMINISTRADOR" && (
              <Link onClick={closeMenus} to="/admin" className="mt-2 flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold text-slate-700">
                <LayoutDashboard size={17} />
                Menu administrativo
              </Link>
            )}
            {user?.role === "PROPIETARIO" && (
              <Link onClick={closeMenus} to="/owner" className="mt-2 flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold text-slate-700">
                <LayoutDashboard size={17} />
                Menu propietario
              </Link>
            )}

            {user ? (
              <div className="mt-2 rounded-xl border border-slate-200 p-2">
                <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-400">Mi perfil</p>
                <Link onClick={closeMenus} to="/profile?section=profile" className="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-700">
                  <User size={17} />
                  Actualizar perfil
                </Link>
                <Link onClick={closeMenus} to="/profile?section=password" className="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-700">
                  <KeyRound size={17} />
                  Cambiar contrasena
                </Link>
                {user.role !== "ADMINISTRADOR" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setConfirmDeactivateOpen((current) => !current)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-slate-700"
                    >
                      <Settings size={17} />
                      Desactivar cuenta
                    </button>
                    {confirmDeactivateOpen && (
                      <div className="mx-2 rounded-xl border border-red-100 bg-red-50 p-3">
                        <p className="text-sm font-semibold text-red-700">Seguro quieres desactivar tu cuenta?</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button type="button" onClick={deactivateAccount} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white">
                            Si
                          </button>
                          <button type="button" onClick={() => setConfirmDeactivateOpen(false)} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600">
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <Link onClick={() => setOpen(false)} to="/login" className="mt-2 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-white">
                <LogIn size={17} />
                Iniciar sesion
              </Link>
            )}

            {user && (
              <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-xl border px-4 py-2 font-semibold text-slate-700" type="button">
                <LogOut size={17} />
                Cerrar sesion
              </button>
            )}
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

function ProfileMenuLink({ to, icon: Icon, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950"
    >
      <Icon size={17} />
      {children}
    </Link>
  );
}

export default PublicLayout;
