import PageHeader from "../../../components/ui/PageHeader";

function AdminDashboardPage() {
  const items = [
    {
      title: "Categorías",
      description: "Crear, editar y controlar las categorías usadas por actividades."
    },
    {
      title: "Actividades",
      description: "Revisar publicaciones y cambiar su estado a activa, pendiente o inactiva."
    },
    {
      title: "Imágenes",
      description: "Las imágenes se gestionan desde cada actividad por propietario o administrador."
    }
  ];

  return (
    <section>
      <PageHeader
        title="Panel administrativo"
        description="Resumen de acciones disponibles para controlar CitySpot."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
