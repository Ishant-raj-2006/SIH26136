import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|svg|favicon).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Get hostname of request (e.g. startup.localhost:3000)
  const hostname = req.headers.get('host') || '';
  
  // Strip port for checking
  const currentHost = hostname.split(':')[0];

  // Ignore localhost root or main domain
  if (currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost === 'sih26136.com') {
    return NextResponse.next();
  }

  // Extract subdomain (e.g. 'startup' from 'startup.localhost')
  const subdomain = currentHost.split('.')[0];
  const validSubdomains = ['startup', 'ministry', 'department', 'maintenance'];

  if (validSubdomains.includes(subdomain)) {
    // Map subdomains to their respective roles in the app
    let role = subdomain;
    
    // If user accesses the root of the subdomain, show the main page but open the auth modal for their role
    if (url.pathname === '/') {
       url.pathname = '/';
       url.searchParams.set('auth', 'signin');
       url.searchParams.set('role', role);
       return NextResponse.rewrite(url);
    }
    
    // For other paths let them pass through normally
    const res = NextResponse.next();
    res.headers.set('x-current-site', subdomain);
    return res;
  }

  return NextResponse.next();
}
