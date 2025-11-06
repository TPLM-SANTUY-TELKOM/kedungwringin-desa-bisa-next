import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type JenisKelamin = 'Laki-laki' | 'Perempuan';
type StatusKawin = 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
type StatusPerkawinan = 'Belum menikah' | 'Menikah' | 'Duda' | 'Janda';

type PendudukRow = {
  id: string;
  nik: string;
  no_kk: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: JenisKelamin;
  status_kawin: StatusKawin;
  alamat: string;
  dusun: string;
  rt: string;
  rw: string;
  agama: string;
  pendidikan: string | null;
  pekerjaan: string | null;
  status: string;
  golongan_darah?: string | null;
  status_perkawinan?: StatusPerkawinan | null;
  no_akta_lahir?: string | null;
  umur?: number | null;
  [key: string]: unknown;
};

const DEFAULT_COLUMNS = [
  'id',
  'nik',
  'no_kk',
  'nama',
  'tempat_lahir',
  'tanggal_lahir',
  'jenis_kelamin',
  'golongan_darah',
  'agama',
  'pendidikan',
  'pekerjaan',
  'status_kawin',
  'status_perkawinan',
  'status',
  'alamat',
  'dusun',
  'rt',
  'rw',
  'no_akta_lahir',
  'umur',
].join(', ');

const statusPerkawinanFromStatusKawin = (
  statusKawin: StatusKawin,
  jenisKelamin: JenisKelamin,
): StatusPerkawinan => {
  switch (statusKawin) {
    case 'Belum Kawin':
      return 'Belum menikah';
    case 'Kawin':
      return 'Menikah';
    case 'Cerai Hidup':
    case 'Cerai Mati':
      return jenisKelamin === 'Perempuan' ? 'Janda' : 'Duda';
    default:
      return 'Menikah';
  }
};

const statusKawinFromPerkawinan = (status?: string): StatusKawin | undefined => {
  if (!status) return undefined;

  switch (status.toLowerCase()) {
    case 'belum menikah':
    case 'belum kawin':
      return 'Belum Kawin';
    case 'menikah':
    case 'kawin':
      return 'Kawin';
    case 'duda':
      return 'Cerai Hidup';
    case 'janda':
      return 'Cerai Hidup';
    default:
      return undefined;
  }
};

const normalizeGolonganDarah = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  if (!normalized) return null;

  const allowed = new Set([
    'A',
    'B',
    'AB',
    'O',
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ]);

  return allowed.has(normalized) ? normalized : null;
};

const enrichPendudukResponse = (data: PendudukRow | PendudukRow[] | null) => {
  if (!data) return null;

  const enrich = (row: PendudukRow) => ({
    ...row,
    golongan_darah: normalizeGolonganDarah(row.golongan_darah ?? null),
    status_perkawinan:
      row.status_perkawinan ??
      statusPerkawinanFromStatusKawin(row.status_kawin, row.jenis_kelamin),
  });

  return Array.isArray(data) ? data.map(enrich) : enrich(data);
};

const sanitizePayload = (payload: Record<string, unknown>) => {
  const { status_perkawinan, ...rest } = payload;
  const normalized: Record<string, unknown> = { ...rest };

  if (!normalized.status_kawin && typeof status_perkawinan === 'string') {
    const mapped = statusKawinFromPerkawinan(status_perkawinan);
    if (mapped) normalized.status_kawin = mapped;
  }

  if (normalized.golongan_darah) {
    normalized.golongan_darah = normalizeGolonganDarah(normalized.golongan_darah);
  }

  delete normalized.status_perkawinan;

  return normalized;
};

const jsonError = (message: string, status = 500) =>
  NextResponse.json({ error: { message } }, { status });

const extractFilter = (
  request: NextRequest,
  body?: Record<string, unknown>,
): { column: string; value: unknown } | null => {
  const { searchParams } = new URL(request.url);
  const entries = Array.from(searchParams.entries());

  if (entries.length > 0) {
    const [column, value] = entries[0];
    return { column, value };
  }

  const filterFromBody = (body?.filter ?? body) as
    | { column?: string; value?: unknown }
    | undefined;

  if (filterFromBody?.column && typeof filterFromBody.column === 'string') {
    return { column: filterFromBody.column, value: filterFromBody.value };
  }

  if (typeof body?.column === 'string') {
    return { column: body.column, value: body.value };
  }

  return null;
};

// GET - Select data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requested = searchParams.get('columns');
    const columns = !requested || requested === '*' ? DEFAULT_COLUMNS : requested;
    const single = searchParams.get('single') === 'true';

    const result = await db.from('penduduk').select(columns, { single });

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(enrichPendudukResponse(result.data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('GET penduduk error:', error);
    return jsonError(message);
  }
}

// POST - Insert data
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = sanitizePayload(body);
    const result = await db.from('penduduk').insert(payload);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(enrichPendudukResponse(result.data as PendudukRow));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('POST penduduk error:', error);
    return jsonError(message);
  }
}

// PUT/PATCH - Update data
async function handleUpdate(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payloadSource =
      body.data && typeof body.data === 'object' ? (body.data as Record<string, unknown>) : body;

    if (!payloadSource || Object.keys(payloadSource).length === 0) {
      return jsonError('Payload data is required', 400);
    }

    const filter = extractFilter(request, body);
    if (!filter) {
      return jsonError('WHERE clause is required', 400);
    }

    const payload = sanitizePayload(payloadSource);
    const result = await db.from('penduduk').update(payload).eq(filter.column, filter.value);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(enrichPendudukResponse(result.data as PendudukRow));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('UPDATE penduduk error:', error);
    return jsonError(message);
  }
}

export async function PUT(request: NextRequest) {
  return handleUpdate(request);
}

export async function PATCH(request: NextRequest) {
  return handleUpdate(request);
}

// DELETE - Delete data
export async function DELETE(request: NextRequest) {
  try {
    let body: Record<string, unknown> | undefined;
    if (request.headers.get('content-length')) {
      body = (await request.json()) as Record<string, unknown>;
    }

    const filter = extractFilter(request, body);
    if (!filter) {
      return jsonError('WHERE clause is required', 400);
    }

    const result = await db.from('penduduk').delete().eq(filter.column, filter.value);

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('DELETE penduduk error:', error);
    return jsonError(message);
  }
}
