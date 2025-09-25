import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Helper function to extract token from Authorization header
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Helper function to verify JWT token
async function verifyToken(token: string) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    return decoded;
  } catch (error: unknown) {
    throw new Error('Invalid or expired token');
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Extract and verify token
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    
    // Get request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user and include password field
    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is using local authentication (has a password)
    if (user.provider !== 'local' || !user.password) {
      const providerName = user.provider === 'google' ? 'Google' : 'OAuth';
      return NextResponse.json(
        { 
          success: false, 
          message: `Password change is not available for ${providerName} accounts. Please manage your password through your ${providerName} account settings.` 
        },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, message: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(
      decoded.id,
      { password: hashedNewPassword },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error: unknown) {
    console.error('Password change error:', error);
    
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}