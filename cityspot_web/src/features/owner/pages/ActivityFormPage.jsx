import { ArrowLeft, LogOut, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clearSession } from "../../../services/sessionStorage";
import { activityService } from "../../activities/services/activityService";
import { categoryService } from "../../categories/services/categoryService";

const empty = {
  categoryId: "",
  name: "",
  description: "",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
  referencePrice: "",
  schedule: "",
  contactPhone: "",
  contactEmail: ""
};

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.categories)) return response.categories;
  return [];
}

function normalizeActivity(activity) {
  return {
    categoryId: activity.categoryId ?? "",
    name: activity.name ?? "",
    description: activity.description ?? "",
    city: activity.city ?? "",
    address: activity.address ?? "",
    latitude: activity.latitude ?? "",
    longitude: activity.longitude ?? "",
    referencePrice: activity.referencePrice ?? "",
    schedule: activity.schedule ?? "",
    contactPhone: activity.contactPhone ?? "",
    contactEmail: activity.contactEmail ?? ""
  };
}

function ActivityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  useEffect(() => {
    categoryService.list()
      .then((response) => setCategories(getList(response)))
      .catch((err) => setError(err.message));

    if (isEditing) {
      activityService.listMine()
        .then((response) => {
          const activities = Array.isArray(response) ? response : response.activities || [];
          const activity = activities.find((item) => item.id === Number(id));
          if (!activity) throw new Error("No se encontro la actividad del propietario.");
          setForm(normalizeActivity(activity));
        })
        .catch((err) => setError(err.message));
    }
  }, [id, isEditing]);

  const change = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.latitude && (Number(form.latitude) < -90 || Number(form.latitude) > 90)) {
      setError("La latitud debe estar entre -90 y 90.");
      return;
    }

    if (form.longitude && (Number(form.longitude) < -180 || Number(form.longitude) > 180)) {
      setError("La longitud debe estar entre -180 y 180.");
      return;
    }

    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
      referencePrice: form.referencePrice === "" ? null : Number(form.referencePrice)
    };

    setLoading(true);
    try {
      if (isEditing) {
        await activityService.update(id, payload);
      } else {
        await activityService.create(payload);
      }
      navigate("/owner/activities");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/owner/activities" className="flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={17} /> Volver</Link>
          <h1 className="mt-4 text-3xl font-black">{isEditing ? "Editar actividad" : "Nueva actividad"}</h1>
          <p className="mt-2 text-slate-500">Completa la informacion de la actividad.</p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            <User size={17} />
            Mi perfil
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
            type="button"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={submit} className="mt-8 grid gap-5 rounded-2xl border bg-white p-6 shadow-sm sm:grid-cols-2">
        <Field label="Nombre"><input required name="name" value={form.name} onChange={change} className="field" /></Field>
        <Field label="Categoria"><select required name="categoryId" value={form.categoryId} onChange={change} className="field"><option value="">Seleccionar</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
        <Field label="Descripcion" wide><textarea required name="description" value={form.description} onChange={change} className="field min-h-28" /></Field>
        <Field label="Ciudad"><input required name="city" value={form.city} onChange={change} className="field" /></Field>
        <Field label="Direccion"><input name="address" value={form.address} onChange={change} className="field" /></Field>
        <Field label="Latitud"><input type="number" step="any" name="latitude" value={form.latitude} onChange={change} className="field" /></Field>
        <Field label="Longitud"><input type="number" step="any" name="longitude" value={form.longitude} onChange={change} className="field" /></Field>
        <Field label="Precio referencial"><input type="number" min="0" name="referencePrice" value={form.referencePrice} onChange={change} className="field" /></Field>
        <Field label="Horario"><input name="schedule" value={form.schedule} onChange={change} className="field" /></Field>
        <Field label="Telefono"><input name="contactPhone" value={form.contactPhone} onChange={change} className="field" /></Field>
        <Field label="Correo"><input type="email" name="contactEmail" value={form.contactEmail} onChange={change} className="field" /></Field>
        <button disabled={loading} className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white disabled:opacity-60 sm:col-span-2"><Save size={18} /> {loading ? "Guardando..." : "Guardar actividad"}</button>
      </form>
    </section>
  );
}

function Field({ label, wide, children }) {
  return <label className={`text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}><span className="mb-1.5 block">{label}</span>{children}</label>;
}

export default ActivityFormPage;
