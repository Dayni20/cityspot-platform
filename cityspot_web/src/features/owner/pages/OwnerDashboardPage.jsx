import { CheckCircle2, Clock3, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import ProfileActionsMenu from "../../../components/ui/ProfileActionsMenu";
import { activityService } from "../../activities/services/activityService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.activities)) return response.activities;
  return [];
}

function OwnerDashboardPage() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    activityService.listMine()
      .then((response) => setActivities(getList(response)))
      .catch((err) => setError(err.message));
  }, []);

  const cards = [
    { label: "Mis actividades", value: activities.length, icon: MapPinned },
    { label: "Activas", value: activities.filter((activity) => activity.status === "ACTIVA").length, icon: CheckCircle2 },
    { label: "Pendientes", value: activities.filter((activity) => activity.status === "PENDIENTE").length, icon: Clock3 }
  ];

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Resumen de publicaciones</h1>
        </div>
        <ProfileActionsMenu />
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-black">{card.value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-bold">Estado de tus actividades</h2>
        <div className="mt-4 space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-semibold">{activity.name}</p>
                <p className="text-sm text-slate-500">
                  {activity.city} - Categoria {activity.categoryId}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{activity.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OwnerDashboardPage;
