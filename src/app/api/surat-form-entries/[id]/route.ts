import { NextResponse } from "next/server";

import {
  deleteSuratFormEntry,
  findSuratFormEntryById,
  updateSuratFormEntry,
} from "@/lib/suratFormEntryService";

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

export async function PUT(request: Request, context: Params) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: { message: "ID tidak valid" } }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { slug, title, jenis, data } = body ?? {};

    if (!slug || !title || !data || typeof data !== "object") {
      return NextResponse.json(
        { error: { message: "Payload tidak lengkap. Sertakan slug, title, dan data." } },
        { status: 400 },
      );
    }

    const updated = await updateSuratFormEntry({
      id,
      slug,
      title,
      jenis,
      data,
    });

    if (!updated) {
      return NextResponse.json({ error: { message: "Data surat tidak ditemukan" } }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PUT /api/surat-form-entries/${id} error:`, error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Gagal memperbarui surat" } },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: Params) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: { message: "ID tidak valid" } }, { status: 400 });
  }

  try {
    const deleted = await deleteSuratFormEntry(id);
    if (!deleted) {
      return NextResponse.json({ error: { message: "Data surat tidak ditemukan" } }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/surat-form-entries/${id} error:`, error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Gagal menghapus surat" } },
      { status: 500 },
    );
  }
}
