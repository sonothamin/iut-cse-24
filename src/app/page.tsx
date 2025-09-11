
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="container py-5">
      <section className="row align-items-center g-5" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="col-12 col-lg-6">
        <h2>Hello, IUT CSE&apos;24</h2>
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">This is Home</h1>
          <p className="lead">
            Here we gather to connect, to share and to grow. To showcase our joys and sorrows,
            our losses and achievements, and our journey through this heaven of red bricks we call <b>IUT</b>.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <a href="/students" className="btn btn-primary btn-lg px-4 me-md-2">Explore Students</a>
            <a href="/signup" className="btn btn-outline-secondary btn-lg px-4">Join Now</a>
          </div>
        </div>
        <div className="col-12 col-lg-6 text-center">
          <Image src="https://pugcwqebqwshamudkiqc.supabase.co/storage/v1/object/public/public_resources/175739296895993716-removebg-preview%20(2).png" alt="IUT CSE-24" width={500} height={500} />
        </div>
      </section>
    </main>
  );
}

