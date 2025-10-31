import { NextResponse } from 'next/server';

export async function GET() {
  // Temporary mock session - you can implement real auth later
  return NextResponse.json({
    data: {
      session: null
    },
    error: null
  });
}
