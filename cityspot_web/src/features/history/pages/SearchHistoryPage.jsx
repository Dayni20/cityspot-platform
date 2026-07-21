import { RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../../components/ui/EmptyState";
import { searchHistoryService } from "../services/searchHistoryService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.history)) return response.history;
  if (Array.isArray(response?.searchHistory)) return response.searchHistory;
  return [];
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function SearchHistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchHistoryService.list()
      .then((response) => setItems(getList(response)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const repeat = (item) => {
    const params = new URLSearchParams();
    if (item.query) params.set("query", item.query);
    if (item.city) params.set("city", item.city);
    navigate(`/activities?${params.toString()}`);
  };

  const remove = async (id) => {
    setError("");
    try {
      await searchHistoryService.remove(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-black">Historial de busquedas</h1>
      <p className="mt-2 text-slate-500">Repite o elimina busquedas anteriores.</p>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando historial...</p>
        ) : items.length ? (
          items.map((item) => (
            <article key={item.id} className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto]">
              <div>
                <p className="font-bold text-slate-900">{item.query || `${item.activityType || "Busqueda"} en ${item.city || "CitySpot"}`}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Fecha: {formatDate(item.searchedAt)} · Ciudad: {item.city || "N/D"} · Presupuesto: {item.budget ?? "N/D"} · Compania: {item.company || "N/D"}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => repeat(item)} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><RotateCcw size={16} /> Repetir</button>
                <button onClick={() => remove(item.id)} className="rounded-xl border border-red-200 p-2 text-red-600" aria-label="Eliminar busqueda"><Trash2 size={18} /></button>
              </div>
            </article>
          ))
        ) : (
          <EmptyState title="No hay busquedas guardadas" description="Cuando uses recomendaciones con IA, apareceran aqui." />
        )}
      </div>
    </main>
  );
}

export default SearchHistoryPage;
