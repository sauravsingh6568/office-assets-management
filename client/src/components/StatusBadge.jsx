const toneMap = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  ASSIGNED: "bg-brand-100 text-brand-700",
  RETURNED: "bg-sky-100 text-sky-700",
  EXCELLENT: "bg-emerald-100 text-emerald-700",
  GOOD: "bg-amber-100 text-amber-700",
  "VERY GOOD": "bg-sky-100 text-sky-700",
  "NEEDS REPAIR": "bg-rose-100 text-rose-700",
  SCHEDULED: "bg-indigo-100 text-indigo-700",
  "IN REVIEW": "bg-orange-100 text-orange-700",
  "PENDING RETURN": "bg-rose-100 text-rose-700",
  Excellent: "bg-emerald-100 text-emerald-700",
  Good: "bg-amber-100 text-amber-700",
  "Very Good": "bg-sky-100 text-sky-700",
  "Inspection Due": "bg-rose-100 text-rose-700",
  Scheduled: "bg-indigo-100 text-indigo-700",
  "In Review": "bg-orange-100 text-orange-700",
};

function StatusBadge({ value }) {
  const normalizedValue = typeof value === "string" ? value.toUpperCase() : value;
  const label =
    typeof value === "string"
      ? value
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (character) => character.toUpperCase())
      : value;

  return (
    <span className={`status-pill ${toneMap[value] || toneMap[normalizedValue] || "bg-slate-100 text-slate-700"}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
