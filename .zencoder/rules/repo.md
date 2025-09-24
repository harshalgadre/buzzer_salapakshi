---
description: Repository Information Overview
alwaysApply: true
---

# AI Interview Helper Backend Information

## Summary
A Node.js Express backend API for an AI Interview Helper application that helps users prepare for job interviews with features including user authentication, JWT token-based authentication, session management, and interview session tracking.

## Structure
- `/src`: Core application code
  - `/controllers`: Request handlers for routes
  - `/models`: MongoDB schema definitions
  - `/routes`: API route definitions
  - `/middleware`: Custom middleware functions
  - `/config`: Configuration files
- `server.js`: Main application entry point

## Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js 14+ compatible
**Build System**: npm
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- express: ^4.18.2 - Web framework
- mongoose: ^7.5.0 - MongoDB ODM
- jsonwebtoken: ^9.0.2 - JWT implementation
- bcryptjs: ^2.4.3 - Password hashing
- express-validator: ^7.0.1 - Request validation
- dotenv: ^16.3.1 - Environment variable management
- cors: ^2.8.5 - CORS middleware
- morgan: ^1.10.0 - HTTP request logger

**Development Dependencies**:
- nodemon: ^3.0.1 - Development server with auto-reload

## Build & Installation
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Testing
**Framework**: None specified yet
**Test Location**: None specified yet
**Run Command**: None specified yet

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