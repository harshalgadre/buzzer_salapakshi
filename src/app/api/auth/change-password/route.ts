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
  } catch {
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
      console.log('Change password: No token provided');
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    console.log('Change password: Token verified for user ID:', decoded.id);
    
    // Get request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    console.log('Change password: Request body received, currentPassword provided:', !!currentPassword, 'newPassword provided:', !!newPassword);

    // Validate input
    if (!currentPassword || !newPassword) {
      console.log('Change password: Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      console.log('Change password: New password too short');
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user and include password field
    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      console.log('Change password: User not found for ID:', decoded.id);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Change password: User found, provider:', user.provider, 'has password:', !!user.password);

    // Check if user is using local authentication (has a password)
    if (user.provider !== 'local' || !user.password) {
      const providerName = user.provider === 'google' ? 'Google' : 'OAuth';
      console.log('Change password: User is not local auth user, provider:', user.provider);
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
    console.log('Change password: Current password validation result:', isCurrentPasswordValid);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    console.log('Change password: New password same as current:', isSamePassword);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, message: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('Change password: Updating user password');
    await User.findByIdAndUpdate(
      decoded.id,
      { password: hashedNewPassword },
      { new: true }
    );

    console.log('Change password: Password updated successfully for user:', decoded.id);
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error: unknown) {
    console.error('Password change error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Invalid or expired token') {
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