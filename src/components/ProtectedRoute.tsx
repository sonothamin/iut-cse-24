"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  requireRole?: "admin" | "moderator" | "user";
  children: ReactNode;
};

export default function ProtectedRoute({
  requireRole,
  children,
}: Props) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (requireRole && profile?.role !== requireRole) {
      router.push("/");
      return;
    }
  }, [loading, user, profile?.role, requireRole, router]);

  if (loading) return <div className="container py-5">Loading...</div>;
  return <>{children}</>;
}


