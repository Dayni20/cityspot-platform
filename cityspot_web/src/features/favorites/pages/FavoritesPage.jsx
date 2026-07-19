import ActivityCard from "../../../components/ui/ActivityCard";
import EmptyState from "../../../components/ui/EmptyState";
import { activities } from "../../../data/mockData";
import { useState } from "react";
function FavoritesPage(){const [ids,setIds]=useState(()=>JSON.parse(localStorage.getItem("cityspot_favorites")||"[]"));const list=activities.filter(a=>ids.includes(a.id));const remove=a=>{const next=ids.filter(id=>id!==a.id);setIds(next);localStorage.setItem("cityspot_favorites",JSON.stringify(next))};return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><h1 className="text-3xl font-black">Mis favoritos</h1><p className="mt-2 text-slate-500">Tus actividades guardadas.</p><div className="mt-8">{list.length?<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map(a=><ActivityCard key={a.id} activity={a} favorite onFavorite={remove}/>)}</div>:<EmptyState title="Aún no tienes favoritos" description="Explora actividades y presiona el corazón para guardarlas."/>}</div></main>}
export default FavoritesPage;
