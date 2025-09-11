import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="container d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: "100vh" }}>
      <div className="mb-4">
        <i className="fa-solid fa-triangle-exclamation text-warning" style={{ fontSize: "5rem" }}></i>
      </div>

      <h1 className="display-4 fw-bold mb-3">404 - Page Not Found</h1>
      <p className="lead mb-4 text-muted">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="d-flex gap-3 flex-wrap justify-content-center">
        <Link href="/" className="btn btn-primary btn-lg">
          <i className="fa-solid fa-house me-2"></i>Go Home
        </Link>
        <Link href="/students" className="btn btn-outline-secondary btn-lg">
          <i className="fa-solid fa-users me-2"></i>Explore Students
        </Link>
      </div>
    </main>
  );
}
