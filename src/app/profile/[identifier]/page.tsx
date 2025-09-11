"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AvatarImage from "@/components/AvatarImage";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Database } from "@/types/supabase";

type Props = { params: Promise<{ identifier: string }> };

// Extended user type with additional fields not in the base type
type FullUser = Database['public']['Tables']['users']['Row'] & {
  bio: string | null;
  batch_year: number | null;
  avatar_url: string | null;
  github: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  twitter: string | null;
  website: string | null;
  tags: string[] | null;
};

export default function ProfilePage({ params }: Props) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState<FullUser | null>(null);
  const [identifier, setIdentifier] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setIdentifier(resolvedParams.identifier);
    })();
  }, [params]);

  useEffect(() => {
    if (!identifier) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("users")
          .select(`
            id,
            first_name,
            last_name,
            email,
            bio,
            roll,
            section,
            blood_group,
            batch_year,
            avatar_url,
            github,
            facebook,
            linkedin,
            instagram,
            twitter,
            website,
            tags,
            role,
            visible
          `)
          .limit(1);

        if (identifier.includes("@")) query = query.eq("email", identifier);
        else query = query.or(`id.eq.${identifier},roll.eq.${identifier}`);

        const { data, error: queryError } = await query;
        
        if (queryError) {
          throw new Error(`Failed to load user: ${queryError.message}`);
        }

        const userData = data?.[0] as FullUser | undefined;
        if (!userData) {
          setError("User not found");
        } else {
          setUser(userData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while loading the profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [identifier, supabase]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <Link href="/" className="btn btn-primary">Go Home</Link>
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">User Not Found</h4>
          <p>The requested user profile could not be found.</p>
          <hr />
          <p className="mb-0">
            <Link href="/" className="btn btn-primary">Go Home</Link>
          </p>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { icon: "fa-github", url: user.github, label: "GitHub" },
    { icon: "fa-linkedin", url: user.linkedin, label: "LinkedIn" },
    { icon: "fa-facebook", url: user.facebook, label: "Facebook" },
    { icon: "fa-instagram", url: user.instagram, label: "Instagram" },
    { icon: "fa-x-twitter", url: user.twitter, label: "Twitter/X" },
    { icon: "fa-globe", url: user.website, label: "Website" },
  ].filter(link => link.url && link.url.trim() !== "");

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card p-3 text-center">
            <div className="d-flex justify-content-center mb-3">
              <AvatarImage path={user.avatar_url ?? undefined} size={120} />
            </div>
            <h3 className="mb-1">{user.first_name} {user.last_name}</h3>
            <div className="text-muted">{user.email}</div>
            <div className="text-muted">{user.roll} {user.section && `• Sec ${user.section}`}</div>
            <div className="text-muted">{user.blood_group} {user.batch_year && `• Batch ${user.batch_year}`}</div>

            <div className="my-2">
              <span className={`badge text-bg-${user.role === "admin" ? "danger" : user.role === "moderator" ? "warning" : "secondary"}`}>
                {user.role}
              </span>
              {" "}
              <span className={`badge text-bg-${user.visible ? "success" : "secondary"}`}>
                {user.visible ? "Visible" : "Hidden"}
              </span>
            </div>

            {socialLinks.length > 0 && (
              <div className="d-flex justify-content-center gap-3 mt-3">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noreferrer" title={s.label}>
                    <i className={`fa-brands ${s.icon} fs-5`} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card p-3 mb-3">
            <h5 className="mb-2">About</h5>
            <p className="mb-0">{user.bio || "No bio yet."}</p>
          </div>

          {user.tags && user.tags.length > 0 && (
            <div className="card p-3">
              <h6 className="mb-2">Tags</h6>
              <div className="d-flex flex-wrap gap-2">
                {user.tags.map((t) => (
                  <span key={t} className="badge bg-secondary-subtle text-secondary-emphasis">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
