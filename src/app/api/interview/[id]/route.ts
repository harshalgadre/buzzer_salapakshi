import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';
import { authenticate, unauthorized, AuthRequest } from '@/middleware/auth';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);
    
    if (!user) {
      return unauthorized();
    }
    
    await dbConnect();
    
    // Await the params in Next.js 15
    const { id } = await params;
    
    // Get interview by ID
    const interview = await Interview.findById(id);
    
    if (!interview) {
      return NextResponse.json(
        { success: false, message: 'Interview not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the interview
    if (interview.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to access this interview' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: interview },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Get interview error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);
    
    if (!user) {
      return unauthorized();
    }
    
    await dbConnect();
    
    // Await the params in Next.js 15
    const { id } = await params;
    
    // Get interview by ID
    let interview = await Interview.findById(id);
    
    if (!interview) {
      return NextResponse.json(
        { success: false, message: 'Interview not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the interview
    if (interview.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this interview' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Update interview
    interview = await Interview.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    
    return NextResponse.json(
      { success: true, data: interview },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Update interview error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);
    
    if (!user) {
      return unauthorized();
    }
    
    await dbConnect();
    
    // Await the params in Next.js 15
    const { id } = await params;
    
    // Get interview by ID
    const interview = await Interview.findById(id);
    
    if (!interview) {
      return NextResponse.json(
        { success: false, message: 'Interview not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the interview
    if (interview.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this interview' },
        { status: 401 }
      );
    }
    
    // Delete interview
    await Interview.findByIdAndDelete(id);
    
    return NextResponse.json(
      { success: true, data: {} },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Delete interview error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}