import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ActivityCard from "../../../components/ui/ActivityCard";
import EmptyState from "../../../components/ui/EmptyState";
import { getCurrentUser } from "../../../services/sessionStorage";
import { activityService } from "../../activities/services/activityService";
import { favoriteService } from "../../favorites/services/favoriteService";
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
        const response = await imageService.list(activity.activityId ?? activity.id);
        const images = getList(response, "images");
        const mainImage = images.find((image) => image.isMain) || images[0];

        return {
          ...activity,
          imageUrl: activity.imageUrl || mainImage?.imageUrl || mainImage?.url
        };
      } catch {
        return activity;
      }
    })
  );
}

function ExplorePage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("query") || "");
  const categoryId = params.get("categoryId") || "";
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();

  const loadActivities = async () => {
    setLoading(true);
    setError("");
    try {
      const activityResponse = await activityService.listPublic({ categoryId });
      const activitiesWithImages = await attachMainImages(getList(activityResponse, "activities"));
      setActivities(activitiesWithImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities().then(() => {
      if (query.trim()) {
        generateRecommendations(query.trim());
      }
    });
  }, [categoryId]);

  useEffect(() => {
    if (user?.role !== "USUARIO") return;
    favoriteService.list().then((response) => {
      const favorites = getList(response, "favorites");
      setFavoriteIds(favorites.map((favorite) => favorite.activityId ?? favorite.activity?.id));
    }).catch(() => setFavoriteIds([]));
  }, [user?.role]);

  const search = async (event) => {
    event.preventDefault();
    if (query.trim()) {
      await generateRecommendations(query.trim());
      return;
    }

    setRecommendations([]);
    await loadActivities();
  };

  const generateRecommendations = async (requestedQuery = query.trim()) => {
    if (!requestedQuery) {
      setError("Escribe lo que quieres buscar para generar recomendaciones.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await recommendationService.generate({ query: requestedQuery });
      const recommendationsWithImages = await attachMainImages(getList(response, "recommendations"));
      setRecommendations(recommendationsWithImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (activity) => {
    if (user?.role !== "USUARIO") {
      setError("Debes iniciar sesion como usuario turista para guardar favoritos.");
      return;
    }

    try {
      if (favoriteIds.includes(activity.id)) {
        await favoriteService.remove(activity.id);
        setFavoriteIds((current) => current.filter((id) => id !== activity.id));
      } else {
        await favoriteService.add(activity.id);
        setFavoriteIds((current) => [...current, activity.id]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredActivities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesCategory =
        !categoryId ||
        String(activity.categoryId ?? activity.category?.id ?? "") === categoryId;
      const matchesQuery =
        !normalizedQuery ||
        [activity.name, activity.description, activity.city, activity.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [activities, query, categoryId]);

  const visibleActivities = recommendations.length ? recommendations : filteredActivities;
  const isShowingRecommendations = recommendations.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div>
        <p className="font-semibold text-brand-700">Explorar</p>
        <h1 className="text-3xl font-black text-slate-950">Encuentra actividades</h1>
        <p className="mt-2 text-slate-500">Resultados basados en tu busqueda.</p>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={search} className="mt-8 grid gap-3 rounded-2xl border bg-white p-3 shadow-sm md:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
          <Search className="text-brand-600" size={20} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent py-4 outline-none" placeholder="restaurantes en Quito para ir en familia" />
        </label>
        <button className="rounded-xl bg-brand-600 px-7 py-4 font-bold text-white hover:bg-brand-700">Buscar</button>
      </form>

      <div className="mt-8">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-500"><strong className="text-slate-900">{visibleActivities.length}</strong> resultados</p>
            {loading && <p className="text-sm text-slate-500">Cargando...</p>}
          </div>
          {isShowingRecommendations && (
            <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Mostrando recomendaciones generadas con IA para: <strong>{query}</strong>
            </p>
          )}

          {visibleActivities.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleActivities.map((activity) => {
                const activityId = activity.activityId ?? activity.id;
                return (
                  <div key={activityId} className="space-y-3">
                    <ActivityCard activity={{ ...activity, id: activityId }} favorite={favoriteIds.includes(activityId)} onFavorite={toggleFavorite} />
                    {activity.reason && (
                      <p className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                        <strong className="text-emerald-700">Por que se recomienda:</strong> {activity.reason}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </main>
  );
}

export default ExplorePage;
