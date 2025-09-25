# TODO: Integrate Google OAuth with NextAuth and JWT Compatibility

## Completed Tasks
- [x] Install next-auth and @auth/mongodb-adapter
- [x] Update User model to support OAuth providers
- [x] Create NextAuth configuration with Google provider
- [x] Create NextAuth API route
- [x] Update LoginPage to include Google OAuth button
- [x] Add SessionProvider to root layout
- [x] Update auth callbacks to generate JWT tokens for OAuth users
- [x] Update TypeScript types for NextAuth
- [x] Update Dashboard to set JWT token from session for OAuth users
- [x] Simplify logout to use NextAuth signOut

## Remaining Tasks
- [ ] Set up environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [ ] Test the OAuth flow (sign in with Google, JWT token generation, dashboard access)
- [ ] Verify JWT compatibility with existing API endpoints
- [ ] Handle edge cases (existing user with same email, account linking)

## Environment Variables Needed
Add the following to your .env.local file:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Testing Steps
1. Start the development server
2. Navigate to /login
3. Click "Continue with Google"
4. Complete OAuth flow
5. Verify redirect to /dashboard
6. Check that JWT token is set in localStorage
7. Test logout functionality
8. Verify existing JWT-based APIs still work
