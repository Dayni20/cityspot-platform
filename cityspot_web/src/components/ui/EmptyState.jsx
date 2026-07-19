import { SearchX } from "lucide-react";
function EmptyState({ title = "No hay resultados", description = "Prueba con otros filtros." }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><SearchX className="mx-auto text-slate-400" size={34}/><h3 className="mt-3 font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm text-slate-500">{description}</p></div>;
}
export default EmptyState;
