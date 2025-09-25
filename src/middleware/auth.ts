import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';
import dbConnect from '@/lib/mongodb';

export interface AuthRequest extends NextRequest {
  user?: IUser | null;
}

export async function authenticate(req: AuthRequest) {
  let token;
  
  // Get token from authorization header
  const authHeader = req.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return null;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // Connect to database
    await dbConnect();
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Auth error:', message);
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json(
    { success: false, message: 'Not authorized to access this route' },
    { status: 401 }
  );
}