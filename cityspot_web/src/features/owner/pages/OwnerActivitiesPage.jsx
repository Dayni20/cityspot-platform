import { Edit, Image, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";
import { activityService } from "../../activities/services/activityService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.activities)) return response.activities;
  return [];
}

function OwnerActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService.listMine()
      .then((response) => setActivities(getList(response)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const deactivate = async (id) => {
    setError("");
    try {
      await activityService.deactivate(id);
      setActivities((current) => current.filter((activity) => activity.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Mis actividades</h1>
          <p className="mt-2 text-slate-500">Administra tus publicaciones.</p>
        </div>
        <Link to="/owner/activities/new" className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-bold text-white"><PlusCircle size={18} /> Nueva</Link>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando actividades...</p>
        ) : activities.length ? (
          activities.map((activity) => (
            <article key={activity.id} className="grid gap-4 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold">{activity.name}</h2>
                  <StatusBadge status={activity.status} />
                </div>
                <p className="mt-2 text-sm text-slate-500">{activity.city} · Categoria {activity.categoryId} · ${activity.referencePrice ?? "N/D"}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{activity.description}</p>
              </div>
              <div className="flex items-center gap-2 md:flex-col md:justify-center">
                <Link to={`/owner/activities/${activity.id}/edit`} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><Edit size={16} /> Editar</Link>
                <Link to={`/owner/activities/${activity.id}/images`} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><Image size={16} /> Imagenes</Link>
                <button onClick={() => deactivate(activity.id)} className="flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"><Trash2 size={16} /> Eliminar</button>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-2xl border bg-white p-6 text-sm text-slate-500">Todavia no tienes actividades registradas.</p>
        )}
      </div>
    </section>
  );
}

export default OwnerActivitiesPage;
