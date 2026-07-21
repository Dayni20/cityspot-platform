import { useEffect, useState } from "react";
import ActivityCard from "../../../components/ui/ActivityCard";
import EmptyState from "../../../components/ui/EmptyState";
import { activities as mockActivities } from "../../../data/mockData";
import { favoriteService } from "../services/favoriteService";

function getFavoritesFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.favorites)) return response.favorites;
  return [];
}

function getActivityFromFavorite(favorite) {
  const activity = favorite.activity ?? favorite;
  const mockActivity = mockActivities.find((item) => item.id === activity.id || item.id === favorite.activityId);

  return {
    ...mockActivity,
    ...activity,
    id: activity.id ?? favorite.activityId,
    category: activity.category ?? mockActivity?.category ?? `Categoria ${activity.categoryId ?? ""}`.trim(),
    image:
      activity.image ??
      activity.mainImage ??
      activity.imageUrl ??
      activity.images?.[0]?.url ??
      mockActivity?.image ??
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  };
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const loadFavorites = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await favoriteService.list();
      setFavorites(getFavoritesFromResponse(response));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const remove = async (favorite) => {
    const activityId = favorite.activityId ?? favorite.activity?.id ?? favorite.id;

    setRemovingId(activityId);
    setError("");

    try {
      await favoriteService.remove(activityId);
      setFavorites((currentFavorites) =>
        currentFavorites.filter((item) => (item.activityId ?? item.activity?.id ?? item.id) !== activityId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const favoriteActivities = favorites.map((favorite) => ({
    favorite,
    activity: getActivityFromFavorite(favorite)
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black">Mis favoritos</h1>
      <p className="mt-2 text-slate-500">Tus actividades guardadas.</p>

      {error && <div className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="mt-8">
        {isLoading ? (
          <p className="text-sm text-slate-500">Cargando favoritos...</p>
        ) : favoriteActivities.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoriteActivities.map(({ favorite, activity }) => (
              <div key={favorite.id ?? favorite.activityId ?? activity.id} className="relative">
                <ActivityCard activity={activity} favorite onFavorite={() => remove(favorite)} />
                {removingId === activity.id && (
                  <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/70 text-sm font-semibold text-slate-600">
                    Quitando...
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aun no tienes favoritos"
            description="Explora actividades y presiona el corazon para guardarlas."
          />
        )}
      </div>
    </main>
  );
}

export default FavoritesPage;
