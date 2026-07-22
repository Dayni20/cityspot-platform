import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivityCard from "../../../components/ui/ActivityCard";
import { activityService } from "../../activities/services/activityService";
import { categoryService } from "../../categories/services/categoryService";
import { imageService } from "../../images/services/imageService";

function getList(response, key) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.[key])) return response[key];
  return [];
}

async function attachMainImages(activities) {
  return Promise.all(
    activities.map(async (activity) => {
      try {
        const response = await imageService.list(activity.id);
        const images = getList(response, "images");
        const mainImage = images.find((image) => image.isMain) || images[0];
        return { ...activity, imageUrl: activity.imageUrl || mainImage?.imageUrl || mainImage?.url };
      } catch {
        return activity;
      }
    })
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    Promise.all([categoryService.list(), activityService.listPublic()])
      .then(async ([categoryResponse, activityResponse]) => {
        setCategories(getList(categoryResponse, "categories"));
        const activitiesWithImages = await attachMainImages(getList(activityResponse, "activities").slice(0, 3));
        setActivities(activitiesWithImages);
      })
      .catch(() => {
        setCategories([]);
        setActivities([]);
      });
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (city.trim()) params.set("city", city.trim());
    navigate(`/activities?${params.toString()}`);
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-cyan-600 text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <Sparkles size={16} /> Explora Ecuador de una forma diferente
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
              Encuentra tu proxima experiencia inolvidable
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-teal-50">
              Actividades, cultura, gastronomia y naturaleza reunidas en un solo lugar.
            </p>
          </div>

          <form onSubmit={submit} className="mt-10 grid max-w-5xl gap-3 rounded-2xl bg-white p-3 shadow-2xl md:grid-cols-[1.4fr_1fr_auto]">
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
              <Search className="text-brand-600" size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="restaurantes en Quito para ir en familia" className="w-full bg-transparent py-4 text-slate-900 outline-none" />
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
              <MapPin className="text-brand-600" size={20} />
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ciudad" className="w-full bg-transparent py-4 text-slate-900 outline-none" />
            </label>
            <button className="rounded-xl bg-brand-600 px-7 py-4 font-bold text-white hover:bg-brand-700">Buscar</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-semibold text-brand-700">Categorias</p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">Elige como quieres explorar</h2>
          </div>
          <Link to="/activities" className="hidden items-center gap-2 font-semibold text-brand-700 sm:flex">
            Ver todas <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/activities?categoryId=${category.id}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-300 hover:shadow-md">
              <h3 className="text-lg font-bold">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-semibold text-brand-700">Recomendaciones</p>
          <h2 className="mt-1 text-3xl font-black">Experiencias destacadas</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
