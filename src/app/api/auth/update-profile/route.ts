import { NextRequest, NextResponse } from 'next/server';
import { authenticate, unauthorized, AuthRequest } from '@/middleware/auth';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function PUT(req: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticate(req as AuthRequest);

    if (!user) {
      return unauthorized();
    }

    const contentType = req.headers.get('content-type') || '';
    let fullName, bio, phone, location, skills;

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await req.formData();
      fullName = formData.get('fullName') as string;
      bio = formData.get('bio') as string;
      phone = formData.get('phone') as string;
      location = formData.get('location') as string;
      const skillsJson = formData.get('skills') as string;
      skills = skillsJson ? JSON.parse(skillsJson) : [];
      
      const resume = formData.get('resume') as File;
      
      if (resume && resume.size > 0) {
        // Validate file type
        if (resume.type !== 'application/pdf') {
          return NextResponse.json(
            { success: false, message: 'Only PDF files are allowed for resume' },
            { status: 400 }
          );
        }

        // Validate file size (10MB max)
        if (resume.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, message: 'Resume file size cannot exceed 10MB' },
            { status: 400 }
          );
        }

        // Save file
        const bytes = await resume.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create unique filename
        const timestamp = Date.now();
        const filename = `resume_${user._id}_${timestamp}.pdf`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'resumes');
        
        // Ensure directory exists (you might need to create this manually)
        try {
          await writeFile(path.join(uploadPath, filename), buffer);
          user.resumeUrl = `/uploads/resumes/${filename}`;
        } catch (error) {
          console.error('Error saving resume:', error);
          return NextResponse.json(
            { success: false, message: 'Failed to save resume file' },
            { status: 500 }
          );
        }
      }
    } else {
      // Handle JSON request
      const body = await req.json();
      fullName = body.fullName;
      bio = body.bio;
      phone = body.phone;
      location = body.location;
      skills = body.skills;
    }

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

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Bio cannot be more than 500 characters' },
        { status: 400 }
      );
    }

    if (phone && phone.length > 20) {
      return NextResponse.json(
        { success: false, message: 'Phone number cannot be more than 20 characters' },
        { status: 400 }
      );
    }

    if (location && location.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Location cannot be more than 100 characters' },
        { status: 400 }
      );
    }

    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        if (typeof skill !== 'string' || skill.length > 50) {
          return NextResponse.json(
            { success: false, message: 'Each skill cannot be more than 50 characters' },
            { status: 400 }
          );
        }
      }
    }

    // Update user profile
    user.fullName = fullName.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (location !== undefined) user.location = location.trim();
    if (skills !== undefined) user.skills = skills;
    
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
