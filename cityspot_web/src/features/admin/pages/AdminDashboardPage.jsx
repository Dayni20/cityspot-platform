import { MapPinned, Tags } from "lucide-react";

function AdminDashboardPage() {
  const items = [
    {
      title: "Categorías",
      description: "Crear, editar y controlar las categorías usadas por actividades.",
      icon: Tags
    },
    {
      title: "Actividades",
      description: "Revisar publicaciones y cambiar su estado a activa, pendiente o inactiva.",
      icon: MapPinned
    }
  ];

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-950">Panel administrativo</h1>
        <p className="mt-2 text-slate-500">Resumen de acciones disponibles para controlar CitySpot.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
