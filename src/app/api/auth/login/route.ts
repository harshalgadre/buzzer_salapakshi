import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { email, password } = body;
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    console.log('Login attempt for email:', email);
    console.log('User found:', !!user);
    console.log('User provider:', user?.provider);
    console.log('User has password:', !!user?.password);
    
    // If no user found and this is a test email, create a test user
    if (!user && email === 'test@example.com') {
      console.log('Creating test user...');
      await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        provider: 'local'
      });
      console.log('Test user created');
      // Now try to find the user again
      const newUser = await User.findOne({ email }).select('+password');
      if (newUser) {
        const isMatch = await newUser.matchPassword(password);
        if (isMatch) {
          const token = newUser.getSignedJwtToken();
          return NextResponse.json(
            { success: true, token },
            { status: 200 }
          );
        }
      }
    }
    
    if (!user) {
      console.log('No user found with email:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    let token;
    try {
      token = user.getSignedJwtToken();
      console.log('JWT token generated successfully');
    } catch (jwtError) {
      console.error('JWT generation error:', jwtError);
      return NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, token },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Login error:', message);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: message },
      { status: 500 }
    );
  }
}