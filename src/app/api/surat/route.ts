import { NextRequest, NextResponse } from 'next/server';
import { query, db } from '@/lib/db';

// GET - Select data with JOIN support
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const columns = searchParams.get('columns') || '*';
    const single = searchParams.get('single') === 'true';
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const ascending = searchParams.get('ascending') !== 'false';

    // Check if columns contains join syntax (penduduk:)
    const hasJoin = columns.includes('penduduk:') || columns.includes('penduduk_id');
    
    let result;
    const orderDirection = ascending ? 'ASC' : 'DESC';
    
    if (hasJoin) {
      // Perform JOIN query to get surat with penduduk data
      const sql = `
        SELECT 
          s.id,
          s.nomor_surat,
          s.jenis_surat,
          s.penduduk_id,
          s.keperluan,
          s.pejabat_ttd,
          s.tanggal_surat,
          s.created_by,
          s.created_at,
          json_build_object(
            'id', p.id,
            'nama', p.nama,
            'nik', p.nik
          ) as penduduk
        FROM surat s
        LEFT JOIN penduduk p ON s.penduduk_id = p.id
        ORDER BY s.${orderBy} ${orderDirection}
      `;
      
      result = await query(sql);
      
      if (single && result.rows.length > 0) {
        return NextResponse.json(result.rows[0]);
      }
      
      return NextResponse.json(result.rows);
    } else {
      // Simple select without join
      const sql = `SELECT ${columns} FROM surat ORDER BY ${orderBy} ${orderDirection}`;
      result = await query(sql);
      
      if (single && result.rows.length > 0) {
        return NextResponse.json(result.rows[0]);
      }
      
      return NextResponse.json(result.rows);
    }
  } catch (error: any) {
    console.error('GET surat error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}

// POST - Insert data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await db.from('surat').insert(body);
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('POST surat error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}

// PUT - Update data
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json();
    
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) {
      return NextResponse.json(
        { error: { message: 'WHERE clause is required' } },
        { status: 400 }
      );
    }

    const [column, value] = entries[0];
    const result = await db.from('surat').update(body).eq(column, value);
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('PUT surat error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}

// DELETE - Delete data
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) {
      return NextResponse.json(
        { error: { message: 'WHERE clause is required' } },
        { status: 400 }
      );
    }

    const [column, value] = entries[0];
    const result = await db.from('surat').delete().eq(column, value);
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('DELETE surat error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
