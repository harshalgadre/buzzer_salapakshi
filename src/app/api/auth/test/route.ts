import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    // Test database connection
    await dbConnect();
    console.log('Database connection successful');

    // Test JWT secret
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({
        success: false,
        message: 'JWT_SECRET not set',
        env: {
          JWT_SECRET: !!process.env.JWT_SECRET,
          JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
          MONGODB_URI: !!process.env.MONGODB_URI
        }
      });
    }

    // Test user creation (only for testing)
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Creating test user...');
      await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        provider: 'local'
      });
      console.log('Test user created');
    }

    return NextResponse.json({
      success: true,
      message: 'System check passed',
      env: {
        JWT_SECRET: !!process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        MONGODB_URI: !!process.env.MONGODB_URI,
        hasTestUser: !!testUser
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('System check error:', message);
    return NextResponse.json({
      success: false,
      message: 'System check failed',
      error: message
    }, { status: 500 });
  }
}