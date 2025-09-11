"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import AvatarImage from "@/components/AvatarImage";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function Navbar() {
  const { user, profile } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand">
        <Image src="https://pugcwqebqwshamudkiqc.supabase.co/storage/v1/object/public/public_resources/175762235216906317.png" alt="IUT CSE&apos;24" width={60} height={60} /> IUT CSE&apos;24
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link href="/students" className="nav-link">Students</Link></li>
            <li className="nav-item"><Link href="/events" className="nav-link">Events</Link></li>
            <li className="nav-item"><Link href="/notices" className="nav-link">Notices</Link></li>
            <li className="nav-item"><Link href="/clubs" className="nav-link">Clubs</Link></li>
            <li className="nav-item"><Link href="/resources" className="nav-link">Resources</Link></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {profile?.role === "admin" && (
              <li className="nav-item"><Link href="/siteAdmin" className="nav-link"><i className="fa-solid fa-shield-halved me-1"/>Admin</Link></li>
            )}
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <AvatarImage path={profile?.avatar_url ?? undefined} size={28} className="me-2" />
                  <span className="d-none d-sm-inline">{user.email}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                  <li>
                    <Link className="dropdown-item" href={`/profile/${user.id}`}>
                      <i className="fa-regular fa-id-card me-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/settings">
                      <i className="fa-solid fa-gear me-2" /> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={async () => {
                        const supabase = getSupabaseBrowserClient();
                        await supabase.auth.signOut();
                        window.location.href = "/";
                      }}
                    >
                      <i className="fa-solid fa-right-from-bracket me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item"><Link href="/login" className="nav-link">Login</Link></li>
                <li className="nav-item"><Link href="/signup" className="nav-link">Sign up</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}


