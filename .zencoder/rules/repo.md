---
description: Repository Information Overview
alwaysApply: true
---

# AI Interview Helper Next.js Application

## Summary
A Next.js application for an AI Interview Helper that helps users prepare for job interviews with features including user authentication, JWT token-based authentication, session management, and interview session tracking.

## Structure
- `/src`: Core application code
  - `/app`: Next.js App Router structure
    - `/api`: API routes for authentication and interview management
  - `/models`: MongoDB schema definitions
  - `/middleware`: Authentication middleware
  - `/lib`: Utility functions including MongoDB connection

## Language & Runtime
**Language**: TypeScript
**Version**: Node.js 18+ compatible
**Framework**: Next.js
**Package Manager**: npm/yarn

## Dependencies
**Main Dependencies**:
- next: Latest version
- react: Latest version
- react-dom: Latest version
- mongoose: For MongoDB ODM
- jsonwebtoken: For JWT implementation
- bcryptjs: For password hashing
- tailwindcss: For styling

## Build & Installation
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Interview Sessions
- `POST /api/interview` - Create a new interview session
- `GET /api/interview` - Get all interviews for logged in user
- `GET /api/interview/:id` - Get single interview
- `PUT /api/interview/:id` - Update interview
- `DELETE /api/interview/:id` - Delete interview