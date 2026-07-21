import { Save, Trash2, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getCurrentUser, getToken, saveSession } from "../../../services/sessionStorage";
import { profileService } from "../services/profileService";

function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser() || {};
  const [user, setUser] = useState(currentUser);
  const [form, setForm] = useState({ name: currentUser.name || "", email: currentUser.email || "", phone: currentUser.phone || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    profileService.get()
      .then((response) => {
        const profile = response.user ?? response;
        setUser(profile);
        setForm({ name: profile.name || "", email: profile.email || "", phone: profile.phone || "" });
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

  const deactivate = async () => {
    setError("");
    try {
      await profileService.deactivate();
      clearSession();
      navigate("/login", { replace: true, state: { message: "Cuenta desactivada correctamente." } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <UserCircle size={56} className="text-brand-600" />
          <div>
            <h1 className="text-3xl font-black">Mi perfil</h1>
            <p className="text-sm text-slate-500">Rol: {user.role || "USUARIO"} · Estado: {user.status || "ACTIVO"}</p>
          </div>
        </div>

        {message && <p className="mt-6 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={update} className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">Nombre<input className="field mt-1" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label className="text-sm font-semibold">Telefono<input className="field mt-1" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
          <label className="text-sm font-semibold sm:col-span-2">Correo<input type="email" className="field mt-1" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <button disabled={loading} className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white disabled:opacity-60 sm:col-span-2"><Save size={18} />{loading ? "Guardando..." : "Guardar cambios"}</button>
          <button type="button" onClick={deactivate} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-bold text-red-600 sm:col-span-2"><Trash2 size={18} />Desactivar cuenta</button>
        </form>
      </div>
    </main>
  );
}

export default ProfilePage;
