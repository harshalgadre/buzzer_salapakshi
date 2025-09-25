import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json(
      { success: true, message: 'Database connected successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Database connection error:', message);
    return NextResponse.json(
      { success: false, message: 'Database connection failed', error: message },
      { status: 500 }
    );
  }
}