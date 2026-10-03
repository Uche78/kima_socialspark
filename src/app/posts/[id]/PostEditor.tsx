"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SlideCanvas } from "@/components/SlideCanvas";
import { Chips } from "@/components/Chips";
import { dataUrlToBlob } from "@/lib/render";
import { usePostExport } from "@/components/usePostExport";
import { SortableSlideStrip } from "@/components/SortableSlideStrip";
import { ScaledSlide } from "@/components/ScaledSlide";
import { arrayMove } from "@dnd-kit/sortable";
import { fullCaption } from "@/lib/caption";
import { isLowRes, uniqueSuffix } from "@/lib/media";
import { ASPECT_LABELS, aspectOf, textModeOf, textModeOptions, type TextMode, PLATFORM_SPECS, POST_TYPES, type Design, type Listing, type Post, type Profile, type Slide, type SocialAccount, type Aspect } from "@/lib/types";

type Props = { initialPost: Post; listing: Listing; profile: Profile; accounts: SocialAccount[]; isGuest: boolean };

const PREVIEW_WIDTH = 480;
const SLIDE_KINDS: Record<Slide["kind"], string> = { cover: "Cover", photo: "Photo", details: "Details", mortgage: "Mortgage", contact: "Contact" };

function localDateTimeValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostEditor({ initialPost, listing, profile, accounts, isGuest }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  // Give every slide a stable id so it can be dragged; older posts don't have one.
  const [post, setPost] = useState<Post>(() => ({
    ...initialPost,
    slides: initialPost.slides.map((s) => ({ ...s, id: s.id ?? crypto.randomUUID() })),
  }));
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<"copy" | "slide" | "design">("copy");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [accountId, setAccountId] = useState(
    post.social_account_id ?? accounts.find((a) => a.platform === post.platform)?.id ?? "",
  );
  const [scheduleAt, setScheduleAt] = useState(() =>
    localDateTimeValue(post.scheduled_at ? new Date(post.scheduled_at) : new Date(Date.now() + 24 * 3600_000)),
  );

  const spec = PLATFORM_SPECS[post.platform];
  const { targets, renderAll, download, size, canvasProps } = usePostExport(post, listing, profile);
  const slide = post.slides[active] ?? post.slides[0];
  const platformAccounts = accounts.filter((a) => a.platform === post.platform);
  const caption = fullCaption(post);
  const locked = post.status === "published" || post.status === "publishing";

  function patch(p: Partial<Post>) {
    setPost((cur) => ({ ...cur, ...p }));
    setDirty(true);
  }
  function patchDesign(d: Partial<Design>) {
    patch({ design: { ...post.design, ...d } });
  }
  function patchSlide(i: number, s: Partial<Slide>) {
    patch({ slides: post.slides.map((x, j) => (j === i ? { ...x, ...s } : x)) });
  }
  /** Moves a slide; the selected slide stays selected wherever it lands. */
  function reorderSlides(from: number, to: number) {
    if (to < 0 || to >= post.slides.length || from === to) return;
    const selectedId = post.slides[active]?.id;
    const slides = arrayMove(post.slides, from, to);
    patch({ slides });
    setActive(Math.max(0, slides.findIndex((s) => s.id === selectedId)));
  }
  function moveSlide(i: number, dir: -1 | 1) {
    reorderSlides(i, i + dir);
  }

  async function saveFields(extra: Partial<Post> = {}) {
    const next = { ...post, ...extra };
    const { error } = await supabase
      .from("posts")
      .update({
        caption: next.caption,
        hashtags: next.hashtags,
        slides: next.slides,
        design: next.design,
        mortgage: next.mortgage,
        image_paths: next.image_paths,
      })
      .eq("id", post.id);
    if (error) throw new Error(error.message);
    setPost(next);
    setDirty(false);
  }

  /** Renders every slide, uploads the JPEGs, and saves the post. */
  async function saveWithImages() {
    const images = await renderAll();
    const { data } = await supabase.auth.getUser();
    const stamp = uniqueSuffix();
    const paths: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const path = `${data.user!.id}/posts/${post.id}/${stamp}-${String(i + 1).padStart(2, "0")}.jpg`;
      const { error } = await supabase.storage.from("media").upload(path, await dataUrlToBlob(images[i]), { contentType: "image/jpeg" });
      if (error) throw new Error(error.message);
      paths.push(path);
    }
    const old = post.image_paths;
    await saveFields({ image_paths: paths });
    if (old.length) await supabase.storage.from("media").remove(old);
    return images;
  }

  async function run(label: string, fn: () => Promise<string | void>) {
    setBusy(label);
    setMessage(null);
    try {
      const text = await fn();
      if (text) setMessage({ kind: "ok", text });
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setBusy(null);
    }
  }

  const onSave = () => run("save", async () => { await saveWithImages(); return "Saved."; });

  const onDownload = () =>
    run("download", async () => {
      await download();
      return "Downloaded. The caption is copied to your clipboard.";
    });

  const onCopy = () =>
    run("copy", async () => {
      await navigator.clipboard.writeText(caption);
      return "Caption copied.";
    });

  const onPublish = () =>
    run("publish", async () => {
      if (!accountId) throw new Error("Choose an account to publish to.");
      await saveWithImages();
      const res = await fetch(`/api/posts/${post.id}/publish`, { method: "POST", body: JSON.stringify({ social_account_id: accountId }) });
      const json = await res.json();
      router.refresh();
      if (!json.ok) throw new Error(json.error ?? "Publishing failed.");
      setPost((p) => ({ ...p, status: "published", external_url: json.url }));
      return "Published!";
    });

  const onSchedule = () =>
    run("schedule", async () => {
      if (!accountId) throw new Error("Choose an account to post to.");
      await saveWithImages();
      const when = new Date(scheduleAt);
      const res = await fetch(`/api/posts/${post.id}/schedule`, {
        method: "POST",
        body: JSON.stringify({ scheduled_at: when.toISOString(), social_account_id: accountId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPost((p) => ({ ...p, status: "scheduled", scheduled_at: when.toISOString() }));
      return `Scheduled for ${when.toLocaleString()}.`;
    });

  const onReopen = () =>
    run("reopen", async () => {
      const ok = window.confirm(
        `Reopen this post so you can edit and publish it again?\n\nThis won't remove the existing post from ${spec.label}. If it's still live there, publishing again will create a second post.`,
      );
      if (!ok) return;
      const res = await fetch(`/api/posts/${post.id}/reopen`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Couldn't reopen the post.");
      setPost((p) => ({ ...p, status: "draft", published_at: null, external_post_id: null, external_url: null, scheduled_at: null, error: null }));
      router.refresh();
      return "Reopened. Edit anything you like, then publish again.";
    });

  const onUnschedule = () =>
    run("unschedule", async () => {
      await fetch(`/api/posts/${post.id}/schedule`, { method: "DELETE" });
      setPost((p) => ({ ...p, status: "draft", scheduled_at: null }));
      return "Schedule cancelled.";
    });


  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href={`/listings/${listing.id}`} className="text-sm text-muted hover:underline">← {listing.address || "Listing"}</Link>
          <h1 className="mt-1 text-2xl font-semibold">
            {spec.label} {post.format === "carousel" ? "carousel" : "post"} · {POST_TYPES[post.post_type]}
          </h1>
          <div className="text-sm text-muted">
            Status: <span className="font-medium text-foreground">{post.status}</span>
            {post.status === "scheduled" && post.scheduled_at && ` for ${new Date(post.scheduled_at).toLocaleString()}`}
            {post.external_url && (
              <> · <a className="underline" href={post.external_url} target="_blank" rel="noreferrer">View post</a></>
            )}
          </div>
          {post.status === "failed" && post.error && <div className="text-sm text-red-700">{post.error}</div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={onCopy} disabled={!!busy}>Copy caption</button>
          <button className="btn-secondary" onClick={onDownload} disabled={!!busy}>{busy === "download" ? "Preparing…" : "Download"}</button>
          <button className="btn-primary" onClick={onSave} disabled={!!busy || locked}>{busy === "save" ? "Saving…" : dirty ? "Save" : "Saved"}</button>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg p-3 text-sm ${message.kind === "ok" ? "bg-green-50 text-green-900" : "bg-red-50 text-red-800"}`}>{message.text}</div>
      )}

      {/* grid-cols-1 caps the single phone column at the screen width (minmax(0, 1fr)) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
        {/* Preview: scales to the available width (up to 480px) so it fits on phones */}
        <div className="w-full min-w-0 lg:w-[480px]">
          <ScaledSlide width={size.w} height={size.h} maxWidth={PREVIEW_WIDTH} className="rounded-xl border border-border shadow-sm">
            {slide && <SlideCanvas {...canvasProps} slide={slide} index={active} />}
          </ScaledSlide>
          {post.slides.length > 1 && (
            <div className="mt-3">
              <SortableSlideStrip
                slides={post.slides as (Slide & { id: string })[]}
                active={active}
                disabled={locked}
                canvasProps={canvasProps}
                onSelect={(i) => { setActive(i); setTab("slide"); }}
                onReorder={reorderSlides}
              />
              {!locked && (
                <p className="text-xs text-muted">
                  <span className="hidden sm:inline">Drag slides to reorder. Click a slide to edit it.</span>
                  <span className="sm:hidden">Press and hold a slide to drag it. Tap to edit.</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="card min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
            {(["copy", "slide", "design"] as const).map((t) => (
              <button key={t} className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium ${tab === t ? "border-brand text-brand" : "border-transparent text-muted"}`} onClick={() => setTab(t)}>
                {t === "copy" ? "Caption" : t === "slide" ? `Slide ${active + 1}` : "Design & branding"}
              </button>
            ))}
          </div>

          {tab === "copy" && (
            <div className="space-y-4">
              <label className="block">
                <span className="label">Caption</span>
                <textarea className="input min-h-72 font-[inherit] leading-relaxed" value={post.caption} disabled={locked} onChange={(e) => patch({ caption: e.target.value })} />
                <span className={`text-xs ${caption.length > spec.captionLimit ? "text-red-700" : "text-muted"}`}>
                  {caption.length} / {spec.captionLimit} characters (including hashtags)
                </span>
              </label>
              <label className="block">
                <span className="label">Hashtags (space separated)</span>
                <input
                  className="input"
                  disabled={locked}
                  value={post.hashtags.map((h) => `#${h}`).join(" ")}
                  onChange={(e) => patch({ hashtags: e.target.value.split(/\s+/).map((h) => h.replace(/^#/, "")).filter(Boolean) })}
                />
              </label>
            </div>
          )}

          {tab === "slide" && slide && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{SLIDE_KINDS[slide.kind]} slide</span>
                {post.slides.length > 1 && !locked && (
                  <div className="flex gap-1">
                    <button className="btn-ghost px-2 py-1" onClick={() => moveSlide(active, -1)} disabled={active === 0}>←</button>
                    <button className="btn-ghost px-2 py-1" onClick={() => moveSlide(active, 1)} disabled={active === post.slides.length - 1}>→</button>
                    <button
                      className="btn-ghost px-2 py-1 text-red-700"
                      onClick={() => { patch({ slides: post.slides.filter((_, j) => j !== active) }); setActive(Math.max(0, active - 1)); }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <label className="block">
                <span className="label">Headline</span>
                <input className="input" disabled={locked} value={slide.headline} onChange={(e) => patchSlide(active, { headline: e.target.value })} />
              </label>
              <label className="block">
                <span className="label">Supporting text</span>
                <input className="input" disabled={locked} value={slide.subtext} onChange={(e) => patchSlide(active, { subtext: e.target.value })} />
              </label>
              <div>
                <span className="label">Photo</span>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                  {slide.kind !== "cover" && slide.kind !== "photo" && (
                    <button disabled={locked} onClick={() => patchSlide(active, { photo_index: null })} className={`aspect-square rounded-md border-2 text-xs text-muted ${slide.photo_index == null ? "border-brand" : "border-border"}`}>
                      None
                    </button>
                  )}
                  {listing.photos.map((p, i) => (
                    <button key={p.path} disabled={locked} onClick={() => patchSlide(active, { photo_index: i })} className={`relative aspect-square overflow-hidden rounded-md border-2 ${slide.photo_index === i ? "border-brand" : "border-transparent"}`}>
                      <img src={p.url} alt="" className="h-full w-full object-cover" />
                      {isLowRes(p) && (
                        <span title={`${p.width}×${p.height}px. May look soft in a post.`} className="absolute inset-x-0 bottom-0 bg-amber-500/90 text-center text-[9px] font-semibold text-white">LOW-RES</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {post.format === "carousel" && !locked && post.slides.length < spec.maxSlides && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    const used = new Set(post.slides.map((s) => s.photo_index));
                    const free = listing.photos.findIndex((_, i) => !used.has(i));
                    const slides = [...post.slides];
                    slides.splice(active + 1, 0, { id: crypto.randomUUID(), kind: "photo", headline: "", subtext: "", photo_index: free >= 0 ? free : 0 });
                    patch({ slides });
                    setActive(active + 1);
                  }}
                >
                  + Add photo slide after this one
                </button>
              )}
            </div>
          )}

          {tab === "design" && (
            <div className="space-y-5">
              <Chips label="Template" value={post.design.template} onChange={(template) => patchDesign({ template })} options={{ classic: "Classic", modern: "Modern", minimal: "Minimal" }} />
              <div>
                <Chips
                  label="Text on photos"
                  value={post.format === "single" && textModeOf(post) === "cover" ? "all" : textModeOf(post)}
                  onChange={(m) => patchDesign({ text_mode: m as TextMode })}
                  options={textModeOptions(post.format)}
                />
                {textModeOf(post) !== "all" && (
                  <p className="mt-1.5 text-xs text-muted">
                    Photos without text show just the listing photo. Your name and brokerage stay in the caption.
                  </p>
                )}
              </div>
              {spec.aspects.length > 1 && (
                <div>
                  <Chips
                    label="Size"
                    value={aspectOf(post)}
                    onChange={(aspect) => patchDesign({ aspect })}
                    options={Object.fromEntries(spec.aspects.map((a) => [a, `${ASPECT_LABELS[a]} · ${spec.sizes[a].w}×${spec.sizes[a].h}`])) as Record<Aspect, string>}
                  />
                  {post.platform === "facebook" && aspectOf(post) === "portrait" && (
                    <p className="mt-1.5 text-xs text-muted">Portrait fills more of the mobile feed, but Facebook adds colour bars beside it on desktop.</p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                {(["primary", "secondary", "accent"] as const).map((k) => (
                  <label key={k} className="block">
                    <span className="label">{k}</span>
                    <input type="color" className="h-10 w-full cursor-pointer rounded-lg border border-border" value={post.design[k]} onChange={(e) => patchDesign({ [k]: e.target.value })} />
                  </label>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                {(
                  [
                    ["show_logo", "Logo", !!profile.logo_path],
                    ["show_headshot", "Headshot (contact slide)", !!profile.headshot_path],
                    ["show_contact", "Name & contact details", true],
                    ["show_brokerage", "Brokerage name" + (profile.role === "mortgage_broker" ? " & licence #" : ""), true],
                    ["show_price", "Price", listing.price != null],
                  ] as const
                ).map(([key, label, available]) => (
                  <label key={key} className={`flex items-center gap-2 ${available ? "" : "opacity-50"}`}>
                    <input type="checkbox" disabled={!available} checked={post.design[key] && available} onChange={(e) => patchDesign({ [key]: e.target.checked })} />
                    {label}
                    {!available && key !== "show_price" && <Link href="/settings" className="text-xs underline">add in settings</Link>}
                  </label>
                ))}
              </div>
              {!post.design.show_brokerage && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Most provincial regulators require your brokerage name{profile.role === "mortgage_broker" ? " and licence number" : ""} on posts that promote
                  properties or your services. Make sure it appears in the caption if you hide it here.
                </div>
              )}
              {!profile.brokerage_name && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Add your brokerage name in <Link href="/settings" className="underline">Brand &amp; voice</Link> so it appears on your posts.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Publish */}
      <section className="card p-5">
        <h2 className="mb-3 font-semibold">Publish</h2>
        {isGuest ? (
          <p className="text-sm text-muted">
            <Link href="/login" className="font-medium text-brand underline">Create a free account</Link> to publish or schedule. You can still download the images and copy the caption.
          </p>
        ) : post.status === "published" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              Published{post.published_at ? ` ${new Date(post.published_at).toLocaleString()}` : ""}.
              {post.external_url && (
                <> <a className="underline" href={post.external_url} target="_blank" rel="noreferrer">View on {spec.label}</a></>
              )}
              <span className="mt-1 block text-muted">Deleted it on {spec.label}, or want to make changes? Reopen it to edit and publish again.</span>
            </p>
            <button className="btn-secondary" onClick={onReopen} disabled={!!busy}>
              {busy === "reopen" ? "Reopening…" : "Edit & republish"}
            </button>
          </div>
        ) : platformAccounts.length === 0 ? (
          <p className="text-sm text-muted">
            No {spec.label} account connected. <Link href="/settings#accounts" className="font-medium text-brand underline">Connect one</Link>, or download the images and post manually.
          </p>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="label">Account</span>
              <select className="input min-w-56" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                {platformAccounts.map((a) => <option key={a.id} value={a.id}>{a.account_name}</option>)}
              </select>
            </label>
            <button className="btn-primary" onClick={onPublish} disabled={!!busy}>{busy === "publish" ? "Publishing…" : "Publish now"}</button>
            <span className="px-1 pb-2 text-sm text-muted">or</span>
            <label className="block">
              <span className="label">Schedule for</span>
              <input type="datetime-local" className="input" value={scheduleAt} min={localDateTimeValue(new Date())} onChange={(e) => setScheduleAt(e.target.value)} />
            </label>
            <button className="btn-secondary" onClick={onSchedule} disabled={!!busy}>{busy === "schedule" ? "Scheduling…" : post.status === "scheduled" ? "Reschedule" : "Schedule"}</button>
            {post.status === "scheduled" && <button className="btn-ghost" onClick={onUnschedule} disabled={!!busy}>Cancel schedule</button>}
          </div>
        )}
      </section>

      {targets}
    </div>
  );
}
