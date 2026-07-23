import { Bell, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { reviewService } from "../../features/reviews/services/reviewService";

function OwnerReviewNotifications() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    reviewService.ownerUnreadCount()
      .then((response) => setUnreadCount(Number(response.unreadCount) || 0))
      .catch(() => setUnreadCount(0));
  }, []);

  const openNotifications = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (!nextOpen) return;

    try {
      const response = await reviewService.listOwner();
      setReviews(Array.isArray(response?.reviews) ? response.reviews : []);
      await reviewService.markOwnerAsRead();
      setUnreadCount(0);
    } catch {
      setReviews([]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openNotifications}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
        aria-label="Resenas recibidas"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section className="absolute right-0 top-13 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="border-b border-slate-100 px-2 pb-3">
            <p className="font-bold text-slate-950">Resenas recibidas</p>
            <p className="text-sm text-slate-500">Comentarios de tus actividades</p>
          </div>

          <div className="max-h-96 overflow-y-auto py-2">
            {reviews.length ? (
              reviews.slice(0, 8).map((review) => (
                <article key={review.id} className="rounded-xl px-3 py-3 hover:bg-slate-50">
                  <div className="flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-bold text-slate-900">{review.activityName || "Actividad"}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{review.userName || review.userEmail || "Usuario"}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">{review.comment}</p>
                </article>
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-slate-500">Todavia no tienes resenas.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default OwnerReviewNotifications;
