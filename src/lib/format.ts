export function formatRating(rating: number): string {
  return String(Math.round(rating));
}

export function formatDelta(delta: number): string {
  const r = Math.round(delta);
  return r >= 0 ? `+${r}` : String(r);
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}
