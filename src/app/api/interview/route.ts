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
    const { scenario, meetingUrl, position, company } = body;

    if (!scenario || !meetingUrl || !position || !company) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Create interview
    const interview = await Interview.create({
      ...body,
      userId: user._id.toString() // store as string for consistency
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

    // Get all interviews for logged in user using native MongoDB driver
    const userId = user._id.toString();
    console.log('User ID:', userId, 'Length:', userId.length);
    const mongoose = (await import('mongoose')).default;
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection failed');
    }
    // Get all interviews for debugging
    const allInterviews = await db.collection('interviewsessions').find({}).toArray();
    allInterviews.forEach((doc, idx) => {
      const dbUserId = String(doc.userId);
      console.log(`Interview #${idx}: userId=${dbUserId}, length=${dbUserId.length}`);
    });
    // Fetch all docs, then filter in code for exact userId match
    const allDocs = await db.collection('interviewsessions').find({}).toArray();
    const interviews = allDocs.filter(doc => String(doc.userId) === String(userId));
    console.log('Filtered interviews:', interviews);
    return NextResponse.json(
      { success: true, count: interviews.length, data: interviews, all: allDocs },
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