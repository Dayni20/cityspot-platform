import { Heart, MapPin, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../services/sessionStorage";

function ActivityCard({ activity, favorite = false, onFavorite }) {
  const user = getCurrentUser();
  const image =
    activity.image ||
    activity.mainImage ||
    activity.imageUrl ||
    activity.images?.[0]?.imageUrl ||
    activity.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";
  const category = activity.category || activity.categoryName || "Actividad";
  const price = activity.referencePrice ?? "N/D";
  const schedule = activity.schedule || "Horario por confirmar";
  const detailTarget = user ? `/activities/${activity.id}` : "/login";

  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div className="relative h-52 overflow-hidden"><img src={image} alt={activity.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><button onClick={() => onFavorite?.(activity)} className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow" aria-label="Favorito"><Heart size={19} className={favorite ? "fill-rose-500 text-rose-500" : "text-slate-600"}/></button><span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-700">{category}</span></div>
    <div className="p-5"><div className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={15}/>{activity.city}</div><h3 className="mt-2 text-lg font-bold text-slate-950">{activity.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{activity.description}</p><div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><DollarSign size={14}/>{price === "N/D" ? price : `$${price}`}</span><span className="flex items-center gap-1"><Clock size={14}/>{schedule.split(" ").slice(0,3).join(" ")}</span></div><Link to={detailTarget} className="mt-5 inline-flex w-full justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Ver detalle</Link></div>
  </article>;
}
export default ActivityCard;
