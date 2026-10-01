/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { PLATFORM_SPECS, POST_TYPES, type Photo, type Post } from "@/lib/types";

const STATUS_STYLE: Record<Post["status"], string> = {
  draft: "bg-black/5 text-muted",
  scheduled: "bg-blue-50 text-blue-800",
  publishing: "bg-amber-50 text-amber-800",
  published: "bg-green-50 text-green-800",
  failed: "bg-red-50 text-red-800",
};

export default async function PostsPage() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/");
  const { data } = await supabase
    .from("posts")
    .select("*, listings(address, city, photos)")
    .order("created_at", { ascending: false })
    .limit(100);
  const posts = (data ?? []) as (Post & { listings: { address: string | null; city: string | null; photos: Photo[] } | null })[];

  /** The photo on the post's cover slide, falling back to the listing's cover photo. */
  const mainPhoto = (p: (typeof posts)[number]) => {
    const photos = p.listings?.photos ?? [];
    const cover = p.slides.find((s) => s.kind === "cover") ?? p.slides[0];
    return photos[cover?.photo_index ?? 0]?.url ?? photos[0]?.url ?? null;
  };

  const scheduled = posts.filter((p) => p.status === "scheduled").sort((a, b) => (a.scheduled_at ?? "").localeCompare(b.scheduled_at ?? ""));
  const rest = posts.filter((p) => p.status !== "scheduled");

  const row = (p: (typeof posts)[number]) => (
    <li key={p.id}>
      <Link href={`/posts/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-black/[0.02]">
        <div className="flex min-w-0 items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5">
            {mainPhoto(p) && <img src={mainPhoto(p)!} alt="" loading="lazy" className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0">
          <div className="truncate font-medium">{p.listings?.address ?? "Listing"}</div>
          <div className="text-sm text-muted">
            {PLATFORM_SPECS[p.platform].label} · {p.format} · {POST_TYPES[p.post_type]} · {p.language.toUpperCase()}
          </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {p.status === "scheduled" && p.scheduled_at && <span className="text-muted">{new Date(p.scheduled_at).toLocaleString()}</span>}
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[p.status]}`}>{p.status}</span>
        </div>
      </Link>
    </li>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 space-y-8">
      <h1 className="text-2xl font-semibold">Posts</h1>
      {posts.length === 0 && (
        <p className="text-muted">No posts yet. <Link href="/" className="underline">Start from a listing link.</Link></p>
      )}
      {scheduled.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Scheduled</h2>
          <ul className="card divide-y divide-border">{scheduled.map(row)}</ul>
        </section>
      )}
      {rest.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">All posts</h2>
          <ul className="card divide-y divide-border">{rest.map(row)}</ul>
        </section>
      )}
    </div>
  );
}
