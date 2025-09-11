"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CallbackContent() {
  const searchParams = useSearchParams();
  return <div className="container py-5">
      <div className="alert alert-info">Finishing sign-in...</div>
    </div>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
