"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Drawer } from "@/components/Drawer";
import { PaywallDialog } from "@/components/PaywallDialog";
import { confirmAndDeleteListing } from "@/lib/delete-listing";
import type { Usage } from "@/lib/plans";
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
  const [paywall, setPaywall] = useState<{ kind: "signup" | "upgrade"; message: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const latest = posts[0] ?? null;
  const remaining = usage.limit == null ? null : Math.max(usage.limit - usage.used, 0);

  const closeEditor = useCallback(() => {
    if (editorDirty && !window.confirm("You have unsaved changes. Close without saving?")) return;
    setEditing(false);
    setEditorDirty(false);
  }, [editorDirty]);

  async function generate(settings: PostSettings) {
    setError(null);
    setGenerating(settings);
    try {
      const res = await fetch("/api/posts/generate", { method: "POST", body: JSON.stringify({ listing_id: listing.id, ...settings }) });
      const json = await res.json();
      if (res.status === 402) return setPaywall({ kind: json.paywall, message: json.error });
      if (!res.ok) return setError(json.error ?? "Generation failed.");
      const { data: post } = await supabase.from("posts").select("*").eq("id", json.id).single<Post>();
      if (post) {
        setPosts((p) => [post, ...p]);
        setFreshId(post.id);
      }
      setUsage((u) => ({ ...u, used: u.used + 1 }));
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setGenerating(null);
    }
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
                remaining={remaining}
                generating={!!generating}
                onRegenerate={(focus) => generate({ ...settingsFrom(latest), ...(focus ? { focus } : {}) })}
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
function settingsFrom(post: Post): PostSettings {
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
    mortgage: post.mortgage,
  };
}
