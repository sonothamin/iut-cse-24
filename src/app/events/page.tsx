export default function EventsPage() {
  return (
    <div className="container py-5">
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-outline-secondary btn-sm">Upcoming</button>
        <button className="btn btn-outline-secondary btn-sm">Past</button>
        <button className="btn btn-outline-secondary btn-sm">Organized by me</button>
      </div>
      <div className="card">
        <div className="card-body">Events will show here...</div>
      </div>
    </div>
  );
}


