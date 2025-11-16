import { NextResponse } from "next/server";

import { findSuratFormEntryById } from "@/lib/suratFormEntryService";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Params) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: { message: "ID tidak valid" } }, { status: 400 });
  }

  const entry = await findSuratFormEntryById(id);
  if (!entry) {
    return NextResponse.json({ error: { message: "Data surat tidak ditemukan" } }, { status: 404 });
  }

  return NextResponse.json(entry);
}
