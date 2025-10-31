import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('RPC Request body:', body);
    
    const { fn: fnName, params } = body;

    if (!fnName) {
      return NextResponse.json(
        { error: { message: 'Function name is required' } },
        { status: 400 }
      );
    }

    console.log('Calling RPC function:', fnName, 'with params:', params);
    const result = await db.rpc(fnName, params);
    console.log('RPC result:', result);
    
    if (result.error) {
      console.error('RPC function error:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('RPC error:', error);
    return NextResponse.json(
      { error: { message: error.message, stack: error.stack } },
      { status: 500 }
    );
  }
}
