import { RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../../components/ui/EmptyState";
import { searchHistory as initial } from "../../../data/mockData";
function SearchHistoryPage(){const nav=useNavigate();const [items,setItems]=useState(initial);return <main className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-3xl font-black">Historial de búsquedas</h1><p className="mt-2 text-slate-500">Repite o elimina búsquedas anteriores.</p><div className="mt-8 space-y-3">{items.length?items.map(i=><article key={i.id} className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto]"><div><p className="font-bold text-slate-900">{i.type} en {i.city}</p><p className="mt-1 text-sm text-slate-500">Fecha: {i.date} · Presupuesto: ${i.budget} · Compañía: {i.company}</p></div><div className="flex gap-2"><button onClick={()=>nav(`/activities?city=${i.city}&category=${i.type}`)} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><RotateCcw size={16}/>Repetir</button><button onClick={()=>setItems(items.filter(x=>x.id!==i.id))} className="rounded-xl border border-red-200 p-2 text-red-600"><Trash2 size={18}/></button></div></article>):<EmptyState/>}</div></main>}
export default SearchHistoryPage;
