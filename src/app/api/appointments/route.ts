import { NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validation/appointment";
// Server-side validation. Forwards to the admin API when configured; the key never reaches the browser.
export async function POST(req: Request) {
  const parsed = appointmentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  const base = process.env.CONTENT_API_BASE_URL;
  if (!base) { console.info("[mock] appointment request", parsed.data.email); return NextResponse.json({ ok: true, mock: true }, { status: 201 }); }
  const r = await fetch(`${base}/appointments`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.APPOINTMENTS_API_KEY ?? ""}` }, body: JSON.stringify(parsed.data) });
  return r.ok ? NextResponse.json({ ok: true }, { status: 201 }) : NextResponse.json({ error: "Upstream failed" }, { status: 502 });
}
