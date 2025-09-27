import { NextRequest, NextResponse } from 'next/server';
import { authenticate, unauthorized, AuthRequest } from '@/middleware/auth';

export async function PUT(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);

    if (!user) {
      return unauthorized();
    }

    const { fullName } = await req.json();

    // Validate input
    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid name' },
        { status: 400 }
      );
    }

    if (fullName.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Name cannot be more than 50 characters' },
        { status: 400 }
      );
    }

    // Update user name
    user.fullName = fullName.trim();
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Profile updated successfully', data: user },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Update profile error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}
