import { KeyRound, LogOut, Save, ShieldAlert, Trash2, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearSession, getCurrentUser, getToken, saveSession } from "../../../services/sessionStorage";
import { profileService } from "../services/profileService";

function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = getCurrentUser() || {};
  const [user, setUser] = useState(currentUser);
  const [form, setForm] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const isAdmin = user.role === "ADMINISTRADOR";
  const sectionParam = searchParams.get("section");
  const activeSection = ["profile", "password", "account"].includes(sectionParam) ? sectionParam : "profile";

  useEffect(() => {
    profileService.get()
      .then((response) => {
        const profile = response.user ?? response;
        setUser(profile);
        setForm({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || ""
        });
        saveSession({ token: getToken(), user: profile });
      })
      .catch((err) => setError(err.message));
  }, []);

  const update = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await profileService.update(form);
      const updatedUser = response.user ?? response;
      setUser(updatedUser);
      saveSession({ token: getToken(), user: updatedUser });
      setMessage("Datos actualizados correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setPasswordLoading(true);
    setError("");
    setMessage("");

    try {
      await profileService.updatePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Contrasena actualizada correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const deactivate = async () => {
    setError("");
    setMessage("");

    try {
      await profileService.deactivate();
      clearSession();
      navigate("/login", { replace: true, state: { message: "Cuenta desactivada correctamente." } });
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <UserCircle size={56} className="text-brand-600" />
          <div>
            <h1 className="text-3xl font-black">Mi perfil</h1>
            <p className="text-sm text-slate-500">
              Rol: {user.role || "USUARIO"} - Estado: {user.status || "ACTIVO"}
            </p>
          </div>
        </div>

        {message && <p className="mt-6 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          {activeSection === "profile" && (
            <section>
              <h2 className="text-xl font-black text-slate-950">Actualizar perfil</h2>
              <form onSubmit={update} className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  Nombre
                  <input
                    className="field mt-1 bg-white"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </label>
                <label className="text-sm font-semibold">
                  Telefono
                  <input
                    className="field mt-1 bg-white"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">
                  Correo
                  <input
                    type="email"
                    className="field mt-1 bg-white"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </label>
                <button
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white disabled:opacity-60 sm:col-span-2"
                >
                  <Save size={18} />
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </section>
          )}

          {activeSection === "password" && (
            <section>
              <h2 className="text-xl font-black text-slate-950">Cambiar contrasena</h2>
              <form onSubmit={updatePassword} className="mt-5 grid gap-5">
                <label className="text-sm font-semibold">
                  Contrasena actual
                  <input
                    type="password"
                    className="field mt-1 bg-white"
                    value={passwordForm.currentPassword}
                    onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
                  />
                </label>
                <label className="text-sm font-semibold">
                  Nueva contrasena
                  <input
                    type="password"
                    className="field mt-1 bg-white"
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
                  />
                </label>
                <label className="text-sm font-semibold">
                  Confirmar nueva contrasena
                  <input
                    type="password"
                    className="field mt-1 bg-white"
                    value={passwordForm.confirmPassword}
                    onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
                  />
                </label>
                <button
                  disabled={passwordLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white disabled:opacity-60"
                >
                  <KeyRound size={18} />
                  {passwordLoading ? "Actualizando..." : "Actualizar contrasena"}
                </button>
              </form>
            </section>
          )}

          {activeSection === "account" && (
            <section className="grid gap-4">
              <h2 className="text-xl font-black text-slate-950">Desactivar cuenta</h2>
              <button
                type="button"
                onClick={logout}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                <LogOut size={18} />
                Cerrar sesion
              </button>

              {!isAdmin && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 text-red-600" size={22} />
                    <div>
                      <h2 className="font-bold text-red-700">Desactivar cuenta</h2>
                      <p className="mt-1 text-sm text-red-700">
                        Tu cuenta quedara inactiva y se cerrara la sesion.
                      </p>
                    </div>
                  </div>

                  {confirmDeactivate ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={deactivate}
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700"
                      >
                        <Trash2 size={18} />
                        Si, desactivar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeactivate(false)}
                        className="rounded-xl border border-red-200 bg-white py-3 font-bold text-red-600 hover:bg-red-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeactivate(true)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3 font-bold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                      Desactivar cuenta
                    </button>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
