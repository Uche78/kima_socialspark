"use client";
/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isLowRes, mediaUrl, uniqueSuffix } from "@/lib/media";
import { pickEditable } from "@/lib/listing-fields";
import { PROVINCES, type Listing, type Photo } from "@/lib/types";

const NUMERIC = ["price", "bedrooms", "bathrooms", "square_feet", "year_built"] as const;

/** In draft mode, photos stay in the browser (with the picked File) until the listing is saved. */
type EditorPhoto = Photo & { file?: File };
type EditorListing = Omit<Listing, "photos"> & { photos: EditorPhoto[] };

type Props = {
  listing: Listing;
  /** Unsaved manual entry: nothing is written until the user clicks Save listing. */
  isDraft: boolean;
  onSaved?: (listing: Listing) => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function ListingEditor({ listing: initial, isDraft, onSaved, onDirtyChange }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [listing, setListing] = useState<EditorListing>(initial);
  const [dirty, setDirtyState] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setDirty(d: boolean) {
    setDirtyState(d);
    onDirtyChange?.(d);
  }

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update<K extends keyof EditorListing>(key: K, value: EditorListing[K]) {
    setListing((l) => ({ ...l, [key]: value }));
    setDirty(true);
  }

  async function uploadFiles(listingId: string, files: File[]) {
    const { data } = await supabase.auth.getUser();
    const added: Photo[] = [];
    for (const file of files) {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `${data.user!.id}/listings/${listingId}/u-${uniqueSuffix()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
      if (!error) added.push({ path, url: mediaUrl(path)!, ...(await dimensionsOf(file)) });
    }
    return added;
  }

  async function save(next: EditorListing = listing) {
    setError(null);
    setSaving(true);
    try {
      if (isDraft) {
        // First save of a manual entry: create the listing, then upload the photos picked so far.
        const res = await fetch("/api/listings", {
          method: "POST",
          body: JSON.stringify({ ...pickEditable(next), source_url: next.source_url }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Couldn't save the listing.");
        const pending = next.photos.filter((p) => p.file).map((p) => p.file!);
        const photos = pending.length ? await uploadFiles(json.id, pending) : [];
        if (photos.length) await supabase.from("listings").update({ photos }).eq("id", json.id);
        next.photos.forEach((p) => p.file && URL.revokeObjectURL(p.url));
        setDirty(false);
        router.replace(`/listings/${json.id}`);
        router.refresh();
        return;
      }
      const photos: Photo[] = next.photos.map(({ path, url, source_url, width, height }) => ({ path, url, source_url, width, height }));
      const { error } = await supabase
        .from("listings")
        .update({ ...pickEditable(next), photos })
        .eq("id", next.id);
      if (error) throw new Error(error.message);
      setDirty(false);
      onSaved?.({ ...next, photos });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the listing.");
    } finally {
      setSaving(false);
    }
  }

  async function setPhotos(photos: EditorPhoto[]) {
    const next = { ...listing, photos };
    setListing(next);
    if (isDraft) setDirty(true);
    else await save(next); // photo changes on a saved listing apply immediately
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const picked = Array.from(files);
    if (isDraft) {
      const drafts = await Promise.all(picked.map(async (file) => ({ path: "", url: URL.createObjectURL(file), file, ...(await dimensionsOf(file)) })));
      await setPhotos([...listing.photos, ...drafts]);
      return;
    }
    setUploading(true);
    const added = await uploadFiles(listing.id, picked);
    setUploading(false);
    await setPhotos([...listing.photos, ...added]);
  }

  const field = (key: keyof Listing, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="label">{label}</span>
      <input
        className="input"
        value={(listing[key] as string | number | null) ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          update(key, ((NUMERIC as readonly string[]).includes(key) ? (v === "" ? null : Number(v)) : v || null) as never);
        }}
        {...props}
      />
    </label>
  );

  return (
    <div className="space-y-6">
      {(isDraft || listing.extraction_status === "partial") && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {isDraft
            ? "Enter the property details and add photos, then click Save listing at the bottom. Nothing is saved until then."
            : "Some details or photos couldn't be retrieved. Please review and fill in anything missing."}
          {listing.extraction_notes && <div className="mt-1 text-amber-800/80">{listing.extraction_notes}</div>}
        </div>
      )}

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Photos ({listing.photos.length})</h2>
          <label className="btn-secondary cursor-pointer">
            {uploading ? "Uploading…" : "Upload photos"}
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => upload(e.target.files)} />
          </label>
        </div>
        {listing.photos.length === 0 ? (
          <p className="text-sm text-muted">No photos yet. Upload the listing photos you have permission to use.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {listing.photos.map((p, i) => (
              <div key={p.path || p.url} className="group relative aspect-square overflow-hidden rounded-lg bg-black/5">
                <img src={p.url} alt="" className="h-full w-full object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">COVER</span>}
                {isLowRes(p) && (
                  <span title={`${p.width}×${p.height}px. May look soft in a post.`} className="absolute right-1 top-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">LOW-RES</span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/55 p-1 opacity-0 transition group-hover:opacity-100">
                  {i > 0 ? (
                    <button className="text-[11px] text-white" onClick={() => setPhotos([p, ...listing.photos.filter((_, j) => j !== i)])}>Make cover</button>
                  ) : <span />}
                  <button className="text-[11px] text-white" onClick={() => setPhotos(listing.photos.filter((_, j) => j !== i))}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Property details</h2>
          {!isDraft && <span className="text-sm text-muted">{dirty ? "Unsaved changes" : "All changes saved"}</span>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {field("address", "Address")}
          {field("city", "City")}
          <label className="block">
            <span className="label">Province</span>
            <select className="input" value={listing.province ?? ""} onChange={(e) => update("province", e.target.value || null)}>
              <option value="">—</option>
              {PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
          {field("postal_code", "Postal code")}
          {field("price", listing.transaction_type === "rent" ? "Rent / month" : "Price", { type: "number", min: 0 })}
          <label className="block">
            <span className="label">For</span>
            <select className="input" value={listing.transaction_type} onChange={(e) => update("transaction_type", e.target.value as "sale" | "rent")}>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </label>
          {field("property_type", "Property type")}
          {field("mls_number", "MLS® number")}
          {field("bedrooms", "Bedrooms", { type: "number", min: 0, step: 1 })}
          {field("bathrooms", "Bathrooms", { type: "number", min: 0, step: 0.5 })}
          {field("square_feet", "Square feet", { type: "number", min: 0 })}
          {field("year_built", "Year built", { type: "number" })}
          {field("lot_size", "Lot size")}
          {field("listing_brokerage", "Listing brokerage")}
          {field("open_house", "Open house")}
        </div>
        <label className="mt-3 block">
          <span className="label">Features (one per line)</span>
          <textarea
            className="input min-h-24"
            value={listing.features.join("\n")}
            onChange={(e) => update("features", e.target.value.split("\n"))}
            onBlur={() => update("features", listing.features.map((f) => f.trim()).filter(Boolean))}
          />
        </label>
        <label className="mt-3 block">
          <span className="label">Description</span>
          <textarea className="input min-h-32" value={listing.description ?? ""} onChange={(e) => update("description", e.target.value || null)} />
        </label>
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-border pt-4">
          {error && <span className="text-sm text-red-700">{error}</span>}
          <button className="btn-primary h-11 px-6" disabled={saving || (!isDraft && !dirty)} onClick={() => save()}>
            {saving ? "Saving…" : isDraft ? "Save listing" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </section>
    </div>
  );
}

/** Pixel size of an image file picked in the browser. */
async function dimensionsOf(file: File): Promise<{ width?: number; height?: number }> {
  try {
    const bmp = await createImageBitmap(file);
    const dims = { width: bmp.width, height: bmp.height };
    bmp.close();
    return dims;
  } catch {
    return {};
  }
}
