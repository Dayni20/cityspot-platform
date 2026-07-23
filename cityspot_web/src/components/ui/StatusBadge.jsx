const styles = {
  ACTIVA: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDIENTE: "bg-amber-50 text-amber-700 ring-amber-200",
  RESPONDIDA: "bg-brand-50 text-brand-700 ring-brand-200",
  INACTIVA: "bg-slate-100 text-slate-700 ring-slate-200",
  ACTIVO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  INACTIVO: "bg-slate-100 text-slate-700 ring-slate-200"
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
