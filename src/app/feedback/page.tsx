export default function FeedbackPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-3">Feedback</h1>
      <form className="card p-3">
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input className="form-control" placeholder="Subject" />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea className="form-control" rows={5} placeholder="Write your feedback" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email (optional)</label>
          <input className="form-control" placeholder="your@email.com" />
        </div>
        <button type="button" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}


