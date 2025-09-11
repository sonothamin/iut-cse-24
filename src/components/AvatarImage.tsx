"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type Props = {
  path: string | null | undefined;
  size?: number;
  className?: string;
};

export default function AvatarImage({ path, size = 36, className }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      if (!path) {
        setUrl(null);
        return;
      }
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.storage
        .from("avatar")
        .createSignedUrl(path, 60 * 10); // 10 minutes
      if (!aborted) setUrl(error ? null : data?.signedUrl ?? null);
    })();
    return () => {
      aborted = true;
    };
  }, [path]);

  if (!url) {
    return (
      <div
        className={`bg-secondary d-inline-flex align-items-center justify-content-center rounded-circle ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        <i className="fa-regular fa-user" />
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt="Avatar"
      width={size}
      height={size}
      className={`rounded-circle object-fit-cover ${className ?? ""}`}
    />
  );
}


