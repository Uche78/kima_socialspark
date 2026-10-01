import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { describeSourceUrl, pickEditable } from "@/lib/listing-fields";

// Creates a manually entered listing. Called only when the user clicks Save,
// so abandoned manual entries never leave blank rows behind.
export async function POST(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const fields = pickEditable(body);
  if (typeof fields.address !== "string" || !fields.address.trim()) {
    return NextResponse.json({ error: "Add at least the property address before saving." }, { status: 400 });
  }
  const { source_url, source_site } = describeSourceUrl(typeof body.source_url === "string" ? body.source_url : null);

  const { data, error } = await supabase
    .from("listings")
    .insert({ ...fields, user_id: user.id, source_url, source_site, extraction_status: "manual" })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
