import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authenticate, unauthorized } from '@/middleware/auth';

export async function GET(request: Request) {
  // Authenticate request using Bearer token
  // Only allow authenticated users; optionally restrict to admins later
  // Note: We do not expose password field (it's select:false anyway), but be explicit
  const user = await authenticate(request as any);
  if (!user) {
    return unauthorized();
  }

  try {
    await dbConnect();
    const users = await User.find({}, 'fullName email provider createdAt');
    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}


