import { MessageCircleQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";
import { inquiryService } from "../services/inquiryService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.inquiries)) return response.inquiries;
  return [];
}

function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inquiryService.listMine()
      .then((response) => {
        setInquiries(getList(response));
        return inquiryService.markMineAsRead();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div>
        <p className="font-semibold text-brand-700">Mensajeria interna</p>
        <h1 className="text-3xl font-black text-slate-950">Mis consultas</h1>
        <p className="mt-2 text-slate-500">Aqui ves las preguntas que enviaste a propietarios.</p>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando consultas...</p>
        ) : inquiries.length ? (
          inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">{inquiry.activityName || "Actividad"}</h2>
                  <p className="text-sm text-slate-500">{inquiry.activityCity || "Ciudad no registrada"}</p>
                </div>
                <StatusBadge status={inquiry.status} />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Tu pregunta</p>
                <p className="mt-1 text-sm text-slate-700">{inquiry.question}</p>
              </div>

              <div className="mt-3 rounded-xl bg-brand-50 p-4">
                <p className="text-xs font-semibold uppercase text-brand-700">Respuesta del propietario</p>
                <p className="mt-1 text-sm text-slate-700">
                  {inquiry.answer || "Todavia no hay respuesta."}
                </p>
              </div>

              <Link to={`/activities/${inquiry.activityId}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                <MessageCircleQuestion size={16} />
                Ver actividad
              </Link>
            </article>
          ))
        ) : (
          <p className="rounded-2xl border bg-white p-6 text-sm text-slate-500">Todavia no has enviado consultas.</p>
        )}
      </div>
    </main>
  );
}

export default MyInquiriesPage;
