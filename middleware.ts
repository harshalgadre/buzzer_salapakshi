import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow the request to continue if it's authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For dashboard routes, require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        
        // For console routes, require authentication
        if (req.nextUrl.pathname.startsWith('/console')) {
          return !!token;
        }
        
        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/console/:path*']
};