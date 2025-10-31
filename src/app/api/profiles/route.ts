import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Select data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const columns = searchParams.get('columns') || '*';
    const single = searchParams.get('single') === 'true';

    const result = await db.from('profiles').select(columns, { single });
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('GET profiles error:', error);
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
    const result = await db.from('profiles').insert(body);
    
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('POST profiles error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
