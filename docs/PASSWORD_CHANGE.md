# Password Change Functionality

This document describes the password change functionality implemented in the application.

## Overview

The password change feature allows users with local authentication (not OAuth users like Google) to update their passwords securely. This functionality includes proper validation, security checks, and user feedback.

## API Endpoint

### `PUT /api/auth/change-password`

Changes the password for an authenticated user.

#### Headers
- `Authorization: Bearer <token>` - JWT token for authentication
- `Content-Type: application/json`

#### Request Body
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

#### Responses

**Success (200)**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Validation Errors (400)**
```json
{
  "success": false,
  "message": "Current password and new password are required"
}
```

```json
{
  "success": false,
  "message": "New password must be at least 6 characters long"
}
```

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

```json
{
  "success": false,
  "message": "New password must be different from current password"
}
```

```json
{
  "success": false,
  "message": "Password change is not available for Google accounts. Please manage your password through your Google account settings."
}
```

**Authentication Errors (401)**
```json
{
  "success": false,
  "message": "No token provided"
}
```

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**User Not Found (404)**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Server Error (500)**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Frontend Implementation

### Dashboard Component

The password change functionality is integrated into the Dashboard component (`/src/components/Dashboard.tsx`) with the following features:

#### Features
- **Form Validation**: Client-side validation before API calls
- **Password Strength Indicator**: Visual feedback on password strength
- **Loading States**: UI feedback during password change process
- **Error/Success Messages**: Clear feedback to users
- **OAuth User Handling**: Appropriate message for users who can't change passwords

#### UI Components
- Current password input
- New password input with strength indicator
- Confirm password input
- Update button with loading state
- Success/error message display

#### Validation Rules
- Current password is required
- New password must be at least 6 characters long
- New password must be different from current password
- Password confirmation must match new password

## Security Features

### Backend Security
1. **JWT Authentication**: Verifies user identity before allowing password changes
2. **Current Password Verification**: Ensures user knows the current password
3. **Password Hashing**: Uses bcrypt for secure password storage
4. **Provider Checking**: Prevents OAuth users from changing passwords
5. **Input Validation**: Validates all inputs before processing

### Frontend Security
1. **Input Sanitization**: Clears form inputs after successful change
2. **Secure Communication**: Uses HTTPS for API calls
3. **Token Management**: Proper JWT token handling

## Usage Examples

### Successful Password Change
```javascript
const response = await fetch('/api/auth/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    currentPassword: 'oldpassword123',
    newPassword: 'newpassword456',
  }),
});

const result = await response.json();
// { success: true, message: "Password updated successfully" }
```

### Handling OAuth Users
```javascript
// Check if user can change password
function canChangePassword(userData) {
  return userData?.provider === 'local' || !userData?.provider;
}

if (!canChangePassword(userData)) {
  // Show message that password change is not available
}
```

## Error Handling

The implementation includes comprehensive error handling for:
- Invalid authentication tokens
- Incorrect current passwords
- Weak new passwords
- OAuth user attempts
- Network errors
- Server errors

## Testing

Use the test utilities in `/src/lib/test-utils.ts` to test the password change functionality:

```javascript
import { testPasswordChange } from '@/lib/test-utils';

const result = await testPasswordChange();
console.log(result);
```

## File Structure

```
src/
├── app/api/auth/change-password/
│   └── route.ts                    # API endpoint implementation
├── components/
│   └── Dashboard.tsx              # Frontend implementation
├── lib/
│   ├── password-utils.ts          # Password validation utilities
│   └── test-utils.ts              # Testing utilities
└── models/
    └── User.ts                    # User model with password methods
```

## Environment Variables

Make sure these environment variables are set:
- `JWT_SECRET`: Secret key for JWT token verification
- `JWT_EXPIRES_IN`: Token expiration time (optional, defaults to '30d')