# AI Interview Helper Backend

A backend API for an AI Interview Helper application that helps users prepare for job interviews.

## Features

- User authentication (register, login, logout)
- JWT token-based authentication
- Session management
- Interview session creation and management
- Interview history tracking with performance analysis

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for authentication

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

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/interview-helper
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```
4. Run the server:
   ```
   npm run dev
   ```

## Usage

### Register a new user

```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create a new interview session

```
POST /api/interview
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "scenario": "Job Interview",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "position": "Web Developer",
  "company": "20s Developers",
  "language": "English",
  "scheduledTime": "2025-09-24T03:30:00.000Z"
}
```

## License

MIT