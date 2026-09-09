export default function Loading() {
  return (
    <div className="card slab skeleton" aria-busy="true" aria-label="Loading">
      <div className="bone wide" />
      <div className="bone" />
      <div className="bone" />
      <div className="bone" />
    </div>
  );
}
