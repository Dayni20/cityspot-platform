import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import StatusBadge from "../../../components/ui/StatusBadge";
import { inquiryService } from "../../inquiries/services/inquiryService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.inquiries)) return response.inquiries;
  return [];
}

function OwnerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inquiryService.listOwner()
      .then((response) => setInquiries(getList(response)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const submitAnswer = async (inquiryId) => {
    setError("");
    setSuccess("");

    try {
      const response = await inquiryService.answer(inquiryId, { answer: answers[inquiryId] || "" });
      setInquiries((current) =>
        current.map((inquiry) => (inquiry.id === inquiryId ? response.inquiry : inquiry))
      );
      setAnswers((current) => ({ ...current, [inquiryId]: "" }));
      setSuccess("Respuesta enviada correctamente.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div>
        <h1 className="text-3xl font-black">Consultas recibidas</h1>
        <p className="mt-2 text-slate-500">Responde preguntas que los usuarios hacen sobre tus actividades.</p>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mt-6 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando consultas...</p>
        ) : inquiries.length ? (
          inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">{inquiry.activityName || "Actividad"}</h2>
                  <p className="text-sm text-slate-500">
                    Pregunta de {inquiry.userName || inquiry.userEmail || "usuario"}
                  </p>
                </div>
                <StatusBadge status={inquiry.status} />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Pregunta</p>
                <p className="mt-1 text-sm text-slate-700">{inquiry.question}</p>
              </div>

              {inquiry.answer && (
                <div className="mt-3 rounded-xl bg-brand-50 p-4">
                  <p className="text-xs font-semibold uppercase text-brand-700">Tu respuesta</p>
                  <p className="mt-1 text-sm text-slate-700">{inquiry.answer}</p>
                </div>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <textarea
                  value={answers[inquiry.id] || ""}
                  onChange={(event) => setAnswers((current) => ({ ...current, [inquiry.id]: event.target.value }))}
                  className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"
                  placeholder="Escribe una respuesta para el usuario"
                  maxLength={500}
                />
                <button
                  type="button"
                  onClick={() => submitAnswer(inquiry.id)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700 md:self-end"
                >
                  <Send size={18} />
                  Responder
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-2xl border bg-white p-6 text-sm text-slate-500">Todavia no tienes consultas recibidas.</p>
        )}
      </div>
    </section>
  );
}

export default OwnerInquiriesPage;
