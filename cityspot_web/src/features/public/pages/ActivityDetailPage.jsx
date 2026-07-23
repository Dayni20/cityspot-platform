import { ArrowLeft, Clock, DollarSign, ExternalLink, Mail, MapPin, MessageCircleQuestion, Navigation, Phone, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCurrentUser } from "../../../services/sessionStorage";
import { activityService } from "../../activities/services/activityService";
import { imageService } from "../../images/services/imageService";
import { inquiryService } from "../../inquiries/services/inquiryService";
import { reviewService } from "../../reviews/services/reviewService";

function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [question, setQuestion] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [sendingReview, setSendingReview] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const activityResponse = await activityService.getById(id);
        return activityResponse.activity ?? activityResponse;
      } catch (err) {
        const listResponse = await activityService.listPublic();
        const activities = Array.isArray(listResponse?.activities) ? listResponse.activities : [];
        const fallbackActivity = activities.find((item) => String(item.id) === String(id));

        if (!fallbackActivity) {
          throw err;
        }

        return fallbackActivity;
      }
    };

    Promise.all([
      loadActivity(),
      imageService.list(id).catch(() => ({ images: [] })),
      reviewService.listByActivity(id).catch(() => ({ reviews: [] }))
    ])
      .then(([activityData, imageResponse, reviewResponse]) => {
        setActivity(activityData);
        setImages(Array.isArray(imageResponse?.images) ? imageResponse.images : []);
        setReviews(Array.isArray(reviewResponse?.reviews) ? reviewResponse.reviews : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-4 py-20"><p className="text-slate-500">Cargando actividad...</p></main>;
  }

  if (error || !activity) {
    return <main className="mx-auto max-w-4xl px-4 py-20"><h1 className="text-2xl font-bold">Actividad no encontrada</h1><p className="mt-2 text-sm text-red-600">{error}</p><Link to="/activities" className="mt-4 inline-block text-brand-700">Volver</Link></main>;
  }

  const mainImage =
    images.find((image) => image.isMain)?.imageUrl ||
    images.find((image) => image.isMain)?.url ||
    images[0]?.imageUrl ||
    images[0]?.url ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";
  const latitude = Number(activity.latitude);
  const longitude = Number(activity.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : "";

  const calculateDistance = () => {
    setLocationError("");

    if (!hasCoordinates) {
      setLocationError("Esta actividad no tiene coordenadas registradas.");
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no permite calcular la ubicacion.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        setDistance(getDistanceInKm(userLatitude, userLongitude, latitude, longitude));
      },
      () => setLocationError("No fue posible obtener tu ubicacion actual.")
    );
  };

  const sendInquiry = async (event) => {
    event.preventDefault();
    setError("");
    setInquiryMessage("");
    setSendingInquiry(true);

    try {
      await inquiryService.create(activity.id, { question });
      setQuestion("");
      setInquiryMessage("Tu consulta fue enviada al propietario.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingInquiry(false);
    }
  };

  const sendReview = async (event) => {
    event.preventDefault();
    setError("");
    setReviewMessage("");
    setSendingReview(true);

    try {
      const response = await reviewService.create(activity.id, { rating, comment });
      setReviews((current) => [response.review, ...current]);
      setComment("");
      setRating(5);
      setReviewMessage("Tu resena fue enviada correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingReview(false);
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length
    : 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/activities" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={17} /> Volver a explorar</Link>
      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
        <img src={mainImage} alt={activity.name} className="h-[420px] w-full object-cover" />
        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_320px]">
          <section>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">{activity.category || `Categoria ${activity.categoryId}`}</span>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">{activity.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{activity.description}</p>
            <h2 className="mt-8 text-xl font-bold">Informacion</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Info icon={MapPin} label="Ubicacion" value={`${activity.address || "Direccion por confirmar"}, ${activity.city}`} />
              <Info icon={Clock} label="Horario" value={activity.schedule || "Por confirmar"} />
              <Info icon={Phone} label="Telefono" value={activity.contactPhone || "No registrado"} />
              <Info icon={Mail} label="Correo" value={activity.contactEmail || "No registrado"} />
            </div>
          </section>
          <aside className="h-fit rounded-2xl border bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Precio referencial</p>
            <p className="mt-1 flex items-center text-3xl font-black"><DollarSign size={25} />{activity.referencePrice ?? "N/D"}</p>
            <div className="mt-6 space-y-3">
              {hasCoordinates ? (
                <>
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700"><ExternalLink size={18} /> Ver en Google Maps</a>
                  <button type="button" onClick={calculateDistance} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-100"><Navigation size={18} /> Calcular cercania</button>
                </>
              ) : (
                <p className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500">Ubicacion geografica no registrada.</p>
              )}
              {distance !== null && <p className="rounded-xl bg-brand-50 px-4 py-3 text-center text-sm font-semibold text-brand-700">Estas a {distance.toFixed(1)} km aprox.</p>}
              {locationError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{locationError}</p>}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="text-brand-600" size={20} />
                <h2 className="font-bold text-slate-950">Contactar propietario</h2>
              </div>
              {user?.role === "USUARIO" ? (
                <form onSubmit={sendInquiry} className="mt-4 space-y-3">
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
                    placeholder="Ejemplo: Se permiten mascotas?"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={sendingInquiry}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Send size={18} />
                    {sendingInquiry ? "Enviando..." : "Enviar consulta"}
                  </button>
                  {inquiryMessage && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{inquiryMessage}</p>}
                </form>
              ) : (
                <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-500">
                  Solo los usuarios turistas pueden enviar consultas al propietario.
                </p>
              )}
            </div>
          </aside>
        </div>
        <section className="border-t border-slate-100 p-6 md:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Resenas</h2>
              <p className="mt-1 text-sm text-slate-500">
                {reviews.length
                  ? `${averageRating.toFixed(1)} de 5 basado en ${reviews.length} resena${reviews.length === 1 ? "" : "s"}`
                  : "Todavia no hay resenas para esta actividad."}
              </p>
            </div>
            {reviews.length > 0 && <Stars value={Math.round(averageRating)} readonly />}
          </div>

          {user?.role === "USUARIO" && (
            <form onSubmit={sendReview} className="mt-6 grid gap-4 rounded-2xl border bg-slate-50 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">Tu calificacion</p>
                <Stars value={rating} onChange={setRating} />
              </div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="min-h-28 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
                placeholder="Escribe tu comentario sobre la experiencia"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={sendingReview}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send size={18} />
                {sendingReview ? "Enviando..." : "Enviar resena"}
              </button>
              {reviewMessage && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{reviewMessage}</p>}
            </form>
          )}

          <div className="mt-6 grid gap-4">
            {reviews.slice(0, 5).map((review) => (
              <article key={review.id} className="rounded-2xl border bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-slate-900">{review.userName || "Usuario"}</p>
                  <Stars value={review.rating} readonly />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stars({ value, onChange, readonly = false }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= Number(value);
        const className = active ? "fill-amber-400 text-amber-400" : "text-slate-300";

        if (readonly) {
          return <Star key={star} size={20} className={className} />;
        }

        return (
          <button key={star} type="button" onClick={() => onChange(star)} className="rounded p-1 hover:bg-amber-50" aria-label={`${star} estrellas`}>
            <Star size={24} className={className} />
          </button>
        );
      })}
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return <div className="flex gap-3 rounded-xl border p-4"><Icon className="mt-0.5 text-brand-600" size={20} /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-medium text-slate-700">{value}</p></div></div>;
}

function getDistanceInKm(startLatitude, startLongitude, endLatitude, endLongitude) {
  const earthRadiusKm = 6371;
  const latitudeDistance = toRadians(endLatitude - startLatitude);
  const longitudeDistance = toRadians(endLongitude - startLongitude);
  const startLatitudeRadians = toRadians(startLatitude);
  const endLatitudeRadians = toRadians(endLatitude);
  const calculation =
    Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
    Math.cos(startLatitudeRadians) *
      Math.cos(endLatitudeRadians) *
      Math.sin(longitudeDistance / 2) *
      Math.sin(longitudeDistance / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export default ActivityDetailPage;
