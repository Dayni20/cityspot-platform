import { ArrowRight, Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivityCard from "../../../components/ui/ActivityCard";
import { getCurrentUser } from "../../../services/sessionStorage";
import { activityService } from "../../activities/services/activityService";
import { categoryService } from "../../categories/services/categoryService";
import { imageService } from "../../images/services/imageService";
import { recommendationService } from "../../recommendations/services/recommendationService";

function getList(response, key) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.[key])) return response[key];
  return [];
}

async function attachMainImages(activities) {
  return Promise.all(
    activities.map(async (activity) => {
      try {
        const activityId = activity.activityId ?? activity.id;
        const response = await imageService.list(activityId);
        const images = getList(response, "images");
        const mainImage = images.find((image) => image.isMain) || images[0];
        return {
          ...activity,
          id: activityId,
          imageUrl: activity.imageUrl || mainImage?.imageUrl || mainImage?.url
        };
      } catch {
        return activity;
      }
    })
  );
}

function HomePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [query, setQuery] = useState("");
  const [chatError, setChatError] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
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

  const submit = async (event) => {
    event.preventDefault();
    const requestedQuery = query.trim();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "USUARIO") {
      setChatError("El asistente IA esta disponible para usuarios turistas.");
      return;
    }

    if (!requestedQuery) {
      setChatError("Escribe que tipo de experiencia quieres encontrar.");
      return;
    }

    setChatLoading(true);
    setChatError("");

    try {
      const response = await recommendationService.generate({ query: requestedQuery });
      const recommendationsWithImages = await attachMainImages(
        getList(response, "recommendations")
      );
      setAiRecommendations(recommendationsWithImages);
    } catch (error) {
      setChatError(error.message);
    } finally {
      setChatLoading(false);
    }
  };

  const featuredActivities = aiRecommendations.length ? aiRecommendations : activities;

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
          <p className="font-semibold text-brand-700">
            {aiRecommendations.length ? "Asistente IA" : "Recomendaciones"}
          </p>
          <h2 className="mt-1 text-3xl font-black">
            {aiRecommendations.length ? "Sugerencias personalizadas" : "Experiencias destacadas"}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </section>

      {user?.role === "USUARIO" && (
        <AiAssistantWidget
          query={query}
          setQuery={setQuery}
          submit={submit}
          loading={chatLoading}
          error={chatError}
          recommendations={aiRecommendations}
        />
      )}
    </main>
  );
}

function AiAssistantWidget({ query, setQuery, submit, loading, error, recommendations }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-brand-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15">
                <Bot size={20} />
              </span>
              <div>
                <p className="text-sm font-bold">Asistente IA CitySpot</p>
                <p className="text-xs text-teal-50">Recomendaciones turisticas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Cerrar asistente"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[65vh] space-y-3 overflow-y-auto p-4">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700">
              Hola, dime que plan buscas y te recomiendo actividades reales disponibles.
            </div>

            {query && (
              <div className="ml-auto max-w-[85%] rounded-2xl bg-brand-600 px-4 py-3 text-sm leading-6 text-white">
                {query}
              </div>
            )}

            {loading && (
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                Analizando actividades disponibles...
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p className="font-semibold">
                  Encontre {recommendations.length} recomendaciones para ti:
                </p>
                <div className="mt-3 space-y-2">
                  {recommendations.slice(0, 5).map((activity) => (
                    <a
                      key={activity.id}
                      href={`/activities/${activity.id}`}
                      className="block rounded-xl bg-white px-3 py-2 text-slate-700 shadow-sm hover:text-brand-700"
                    >
                      <span className="font-semibold">{activity.name}</span>
                      {activity.reason && (
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {activity.reason}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-slate-100 p-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej: lugares para pasear en familia"
              className="min-w-0 flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm outline-none ring-1 ring-slate-100 focus:ring-brand-200"
            />
            <button
              disabled={loading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-300"
              aria-label="Enviar consulta"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <div className="flex flex-col items-center gap-3">
        <span className="whitespace-nowrap rounded-full bg-white px-5 py-2 text-sm font-bold text-brand-700 shadow-lg ring-1 ring-slate-200">
          Asistente IA CitySpot
        </span>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-white shadow-2xl ring-4 ring-white transition hover:scale-105 hover:bg-brand-700"
          aria-label="Abrir asistente IA CitySpot"
        >
          {open ? <X size={31} /> : <MessageCircle size={34} />}
        </button>
      </div>
    </div>
  );
}

export default HomePage;
