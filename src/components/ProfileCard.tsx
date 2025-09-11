"use client";

import Link from "next/link";
import AvatarImage from "@/components/AvatarImage";

export type DirectoryUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  roll: string | null;
  section: string | null;
  blood_group: string | null;
  batch_year: number | null;
  tags: string[] | null;
  avatar_url: string | null;
};

export default function ProfileCard({ user }: { user: DirectoryUser }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex gap-3 align-items-center">
        <AvatarImage path={user.avatar_url ?? undefined} size={56} />
        <div className="flex-grow-1">
          <div className="fw-semibold">
            {user.first_name ?? ""} {user.last_name ?? ""}
          </div>
          <div className="text-muted small">
            {user.roll ? `Roll: ${user.roll}` : ""} {user.section ? `• Sec ${user.section}` : ""}
          </div>
          {user.tags && user.tags.length > 0 && (
            <div className="mt-2 d-flex flex-wrap gap-1">
              {user.tags.slice(0, 5).map((t) => (
                <span key={t} className="badge bg-secondary-subtle text-secondary-emphasis">{t}</span>
              ))}
            </div>
          )}
        </div>
        <Link className="btn btn-outline-primary btn-sm" href={`/profile/${user.id}`}>View</Link>
      </div>
    </div>
  );
}


