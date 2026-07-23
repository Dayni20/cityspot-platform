import { ChevronDown, KeyRound, LogOut, Settings, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { profileService } from "../../features/profile/services/profileService";
import { clearSession, getCurrentUser, getToken, saveSession } from "../../services/sessionStorage";

function ProfileActionsMenu({ align = "right" }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser() || {};
  const [open, setOpen] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    profileService.get()
      .then((response) => {
        const profile = response.user ?? response;
        setUser(profile);
        saveSession({ token: getToken(), user: profile });
      })
      .catch(() => undefined);
  }, [open]);

  const resetFeedback = () => {
    setError("");
  };

  const close = () => {
    setOpen(false);
    setConfirmDeactivate(false);
    resetFeedback();
  };

  const logout = () => {
    clearSession();
    close();
    navigate("/login", { replace: true });
  };

  const deactivate = async () => {
    setLoading(true);
    resetFeedback();

    try {
      await profileService.deactivate();
      clearSession();
      close();
      navigate("/login", { replace: true, state: { message: "Cuenta desactivada correctamente." } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
      >
        <User size={17} />
        Mi perfil
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          className={`absolute top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="border-b border-slate-100 px-2 pb-3">
            <p className="truncate font-bold text-slate-950">{user.name || "Usuario"}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="py-2">
            <ActionLink to="/profile?section=profile" icon={User} onClick={close}>
              Actualizar perfil
            </ActionLink>
            <ActionLink to="/profile?section=password" icon={KeyRound} onClick={close}>
              Cambiar contrasena
            </ActionLink>
            {user.role !== "ADMINISTRADOR" && (
              <ActionButton icon={Settings} onClick={() => { setConfirmDeactivate(true); resetFeedback(); }}>
                Desactivar cuenta
              </ActionButton>
            )}
          </div>

          {confirmDeactivate && (
            <div className="mb-2 rounded-xl border border-red-100 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-700">Seguro quieres desactivar tu cuenta?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={deactivate} disabled={loading} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">
                  Si
                </button>
                <button type="button" onClick={() => setConfirmDeactivate(false)} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100">
                  No
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-2">
            <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <LogOut size={17} />
              Cerrar sesion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950"
    >
      <Icon size={17} />
      {children}
    </button>
  );
}

function ActionLink({ to, icon: Icon, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950"
    >
      <Icon size={17} />
      {children}
    </Link>
  );
}

export default ProfileActionsMenu;
