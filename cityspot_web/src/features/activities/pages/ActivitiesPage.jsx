import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import PageHeader from "../../../components/ui/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { activityService } from "../services/activityService";

const statusOptions = ["PENDIENTE", "ACTIVA", "INACTIVA"];

function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await activityService.list();
      setActivities(response.activities);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleStatusChange = async (id, status) => {
    setError("");
    try {
      await activityService.updateStatus(id, status);
      await loadActivities();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <PageHeader
        title="Actividades"
        description="Revisa actividades públicas y administra su estado."
        action={
          <button
            type="button"
            onClick={loadActivities}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        }
      />

      {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Cargando actividades...</p>
        ) : activities.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">
            No hay actividades activas para mostrar. Las actividades pendientes todavía no salen en
            el listado público.
          </p>
        ) : (
          <div className="divide-y divide-slate-200">
            {activities.map((activity) => (
              <article key={activity.id} className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-950">{activity.name}</h2>
                    <StatusBadge status={activity.status} />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{activity.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>Ciudad: {activity.city}</span>
                    <span>Categoría: {activity.categoryId}</span>
                    <span>Propietario: {activity.ownerId}</span>
                    {activity.referencePrice !== null && <span>Precio: ${activity.referencePrice}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={activity.status}
                    onChange={(event) => handleStatusChange(activity.id, event.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ActivitiesPage;
