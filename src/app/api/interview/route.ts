import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';
import { authenticate, unauthorized, AuthRequest } from '@/middleware/auth';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);
    
    if (!user) {
      return unauthorized();
    }
    
    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    const { scenario, meetingLink, position, company, scheduledTime } = body;
    
    if (!scenario || !meetingLink || !position || !company || !scheduledTime) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Create interview
    const interview = await Interview.create({
      ...body,
      user: user._id
    });
    
    return NextResponse.json(
      { success: true, data: interview },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Create interview error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);
    
    if (!user) {
      return unauthorized();
    }
    
    await dbConnect();
    
    // Get all interviews for logged in user
    const interviews = await Interview.find({ user: user._id });
    
    return NextResponse.json(
      { success: true, count: interviews.length, data: interviews },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Get interviews error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}