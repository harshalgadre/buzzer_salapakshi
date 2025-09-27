import { NextRequest, NextResponse } from 'next/server';
import { authenticate, unauthorized, AuthRequest } from '@/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);
    
    if (!user) {
      return unauthorized();
    }
    
    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Get user error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}