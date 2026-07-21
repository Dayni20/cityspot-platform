import { ArrowLeft, Clock, DollarSign, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { activityService } from "../../activities/services/activityService";
import { imageService } from "../../images/services/imageService";

function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      activityService.getById(id),
      imageService.list(id).catch(() => ({ images: [] }))
    ])
      .then(([activityResponse, imageResponse]) => {
        setActivity(activityResponse.activity ?? activityResponse);
        setImages(Array.isArray(imageResponse?.images) ? imageResponse.images : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-4 py-20"><p className="text-slate-500">Cargando actividad...</p></main>;
  }

  if (error || !activity) {
    return <main className="mx-auto max-w-4xl px-4 py-20"><h1 className="text-2xl font-bold">Actividad no encontrada</h1><p className="mt-2 text-sm text-red-600">{error}</p><Link to="/activities" className="mt-4 inline-block text-brand-700">Volver</Link></main>;
  }

  const mainImage = images.find((image) => image.isMain)?.url || images[0]?.url || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/activities" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={17} /> Volver a explorar</Link>
      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
        <img src={mainImage} alt={activity.name} className="h-[420px] w-full object-cover" />
        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_320px]">
          <section>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">{activity.category || `Categoria ${activity.categoryId}`}</span>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">{activity.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{activity.description}</p>
            <h2 className="mt-8 text-xl font-bold">Informacion</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Info icon={MapPin} label="Ubicacion" value={`${activity.address || "Direccion por confirmar"}, ${activity.city}`} />
              <Info icon={Clock} label="Horario" value={activity.schedule || "Por confirmar"} />
              <Info icon={Phone} label="Telefono" value={activity.contactPhone || "No registrado"} />
              <Info icon={Mail} label="Correo" value={activity.contactEmail || "No registrado"} />
            </div>
          </section>
          <aside className="h-fit rounded-2xl border bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Precio referencial</p>
            <p className="mt-1 flex items-center text-3xl font-black"><DollarSign size={25} />{activity.referencePrice ?? "N/D"}</p>
            <a href={activity.contactEmail ? `mailto:${activity.contactEmail}` : undefined} className="mt-6 inline-flex w-full justify-center rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700">Contactar al propietario</a>
            <p className="mt-4 text-center text-xs text-slate-500">La reserva se coordina directamente con el proveedor.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ icon: Icon, label, value }) {
  return <div className="flex gap-3 rounded-xl border p-4"><Icon className="mt-0.5 text-brand-600" size={20} /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-medium text-slate-700">{value}</p></div></div>;
}

export default ActivityDetailPage;
