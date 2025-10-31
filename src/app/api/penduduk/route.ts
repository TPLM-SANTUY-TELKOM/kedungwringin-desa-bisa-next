import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Select data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const columns = searchParams.get('columns') || '*';
    const single = searchParams.get('single') === 'true';

    const result = await db.from('penduduk').select(columns, { single });
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('GET penduduk error:', error);
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
    const result = await db.from('penduduk').insert(body);
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('POST penduduk error:', error);
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
    
    // Get the first query parameter as the WHERE clause
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) {
      return NextResponse.json(
        { error: { message: 'WHERE clause is required' } },
        { status: 400 }
      );
    }

    const [column, value] = entries[0];
    const result = await db.from('penduduk').update(body).eq(column, value);
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('PUT penduduk error:', error);
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
    
    // Get the first query parameter as the WHERE clause
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) {
      return NextResponse.json(
        { error: { message: 'WHERE clause is required' } },
        { status: 400 }
      );
    }

    const [column, value] = entries[0];
    const result = await db.from('penduduk').delete().eq(column, value);
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('DELETE penduduk error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
