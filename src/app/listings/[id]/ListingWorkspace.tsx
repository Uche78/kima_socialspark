"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Drawer } from "@/components/Drawer";
import { PaywallDialog } from "@/components/PaywallDialog";
import { confirmAndDeleteListing } from "@/lib/delete-listing";
import { remaining, withUsed, type AllowanceKind, type Usage } from "@/lib/plans";
import { aspectOf, textModeOf, PLATFORM_SPECS, type Listing, type Post, type Profile } from "@/lib/types";
import { CreatePostCard, type PostSettings } from "./CreatePostCard";
import { LatestResult, LatestResultSkeleton } from "./LatestResult";
import { ListingEditor } from "./ListingEditor";
import { ListingSummary } from "./ListingSummary";
import { PostGrid } from "./PostGrid";

type Props = { listing: Listing; profile: Profile; posts: Post[]; usage: Usage };

export function ListingWorkspace({ listing: initialListing, profile, posts: initialPosts, usage: initialUsage }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [listing, setListing] = useState(initialListing);
  const [posts, setPosts] = useState(initialPosts);
  const [usage, setUsage] = useState(initialUsage);
  // Open the editor straight away when the import came back incomplete and nothing's been made yet.
  const [editing, setEditing] = useState(initialListing.extraction_status === "partial" && initialPosts.length === 0);
  const [editorDirty, setEditorDirty] = useState(false);
  const [generating, setGenerating] = useState<PostSettings | null>(null);
  const [freshId, setFreshId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState<{ kind: "signup" | "upgrade" | "limit"; message: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const latest = posts[0] ?? null;
  const regensLeft = remaining(usage, "regen");

  const closeEditor = useCallback(() => {
    if (editorDirty && !window.confirm("You have unsaved changes. Close without saving?")) return;
    setEditing(false);
    setEditorDirty(false);
  }, [editorDirty]);

  /** regenerateOf: the post being rewritten ("Try another version", "Change focus"), which uses a regeneration. */
  async function generate(settings: PostSettings, regenerateOf?: string) {
    setError(null);
    setGenerating(settings);
    try {
      const res = await fetch("/api/posts/generate", { method: "POST", body: JSON.stringify({ listing_id: listing.id, ...settings, regenerate_of: regenerateOf }) });
      const json = await res.json();
      if (res.status === 402) return setPaywall({ kind: json.paywall, message: json.error });
      if (!res.ok) return setError(json.error ?? "Generation failed.");

      // The post is written in the background; watch the job until it's done.
      const job = await waitForJob(json.job_id);
      if (!job) return setError("This is taking longer than usual. Refresh the page in a minute to see your post. You won't be charged if it doesn't finish.");
      if (job.status === "failed") {
        if (job.paywall) return setPaywall({ kind: job.paywall, message: job.error ?? "" });
        return setError(job.error ?? "Generation failed. You weren't charged. Please try again.");
      }
      const { data: post } = await supabase.from("posts").select("*").eq("id", job.post_id!).single<Post>();
      if (post) {
        setPosts((p) => [post, ...p]);
        setFreshId(post.id);
      }
      setUsage((u) => withUsed(u, (json.kind as AllowanceKind) ?? "post"));
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setGenerating(null);
    }
  }

  /** Polls the generation job (every 2 s, up to 4 minutes). Null = still not finished. */
  async function waitForJob(jobId: string) {
    const deadline = Date.now() + 4 * 60_000;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 2000));
      const { data } = await supabase
        .from("generation_jobs")
        .select("status, post_id, error, paywall")
        .eq("id", jobId)
        .maybeSingle<{ status: string; post_id: string | null; error: string | null; paywall: "signup" | "upgrade" | "limit" | null }>();
      if (data && (data.status === "done" || data.status === "failed")) return data;
    }
    return null;
  }

  async function removeListing() {
    setDeleting(true);
    const result = await confirmAndDeleteListing(listing.id, posts);
    if (!result.deleted) {
      setDeleting(false);
      if (result.error) setError(result.error);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-muted hover:underline">← All listings</Link>
          <h1 className="mt-1 text-2xl font-semibold">{listing.address || "Untitled listing"}</h1>
          {listing.source_url && (
            <a href={listing.source_url} target="_blank" rel="noreferrer" className="text-sm text-muted underline">{listing.source_site}</a>
          )}
        </div>
        <button className="btn-ghost text-red-700" onClick={removeListing} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete listing"}
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(300px,3fr)_7fr]">
        <aside className="lg:sticky lg:top-4">
          <ListingSummary listing={listing} onEdit={() => setEditing(true)} />
        </aside>

        <div className="min-w-0 space-y-6">
          <CreatePostCard
            listing={listing}
            profile={profile}
            usage={usage}
            generating={!!generating}
            error={error}
            onGenerate={generate}
          />
          {generating ? (
            <LatestResultSkeleton label={`${PLATFORM_SPECS[generating.platform].label} ${generating.format === "carousel" ? "carousel" : "post"}`} />
          ) : (
            latest && (
              <LatestResult
                key={latest.id}
                post={latest}
                listing={listing}
                profile={profile}
                fresh={latest.id === freshId}
                usage={usage}
                remaining={regensLeft}
                generating={!!generating}
                onRegenerate={(focus) => generate({ ...settingsFrom(latest, listing), ...(focus ? { focus } : {}) }, latest.id)}
              />
            )
          )}
          <PostGrid posts={posts} listing={listing} profile={profile} />
        </div>
      </div>

      <Drawer open={editing} title="Edit details & photos" onClose={closeEditor}>
        <ListingEditor
          listing={listing}
          isDraft={false}
          onDirtyChange={setEditorDirty}
          onSaved={(l) => {
            setListing(l);
            router.refresh();
          }}
        />
      </Drawer>

      {paywall && <PaywallDialog kind={paywall.kind} message={paywall.message} onClose={() => setPaywall(null)} />}
    </div>
  );
}

/** Rebuilds generation settings from an existing post, for "Try another version". */
function settingsFrom(post: Post, listing: Listing): PostSettings {
  return {
    platform: post.platform,
    format: post.format,
    post_type: post.post_type,
    language: post.language,
    template: post.design.template,
    aspect: aspectOf(post),
    text_mode: textModeOf(post),
    focus: post.focus ?? [],
    notes: post.highlights ?? "",
    include_contact_slide: post.slides.some((s) => s.kind === "contact"),
    include_tour: !!listing.virtual_tour_url,
    mortgage: post.mortgage,
  };
}
