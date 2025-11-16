import { NextResponse } from "next/server";

import { findSuratFormEntriesByBundle } from "@/lib/suratFormEntryService";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const bundleKey = decodeURIComponent(segments.pop() ?? "");

  if (!bundleKey) {
    return NextResponse.json({ error: { message: "Bundle key wajib diisi." } }, { status: 400 });
  }

  const entries = await findSuratFormEntriesByBundle(bundleKey);
  if (!entries || entries.length === 0) {
    return NextResponse.json({ error: { message: "Bundle tidak ditemukan." } }, { status: 404 });
  }

  return NextResponse.json({ entries });
}
