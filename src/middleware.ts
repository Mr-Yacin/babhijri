import { defineMiddleware } from 'astro:middleware';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
    '/app/dashboard',
    '/app/profile',
    '/app/settings',
    '/app/messages',
];

// Admin routes that require admin privileges
const ADMIN_ROUTES = [
    '/app/admin'
];

// Public routes within /app that don't require auth
const PUBLIC_APP_ROUTES = [
    '/app',
    '/app/login',
    '/app/signup'
];

// Admin emails from environment variable (comma-separated)
const ADMIN_EMAILS = (import.meta.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email: string) => email.trim().toLowerCase())
    .filter((email: string) => email.length > 0);

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect, locals } = context;
    const pathname = url.pathname;

    // Check if this is an admin route
    const isAdminRoute = ADMIN_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );

    // Check if this is a protected route
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );

    // Check if this is a public app route
    const isPublicAppRoute = PUBLIC_APP_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );

    if ((isProtectedRoute || isAdminRoute) && !isPublicAppRoute) {
        // Check for Firebase auth session cookie
        const sessionCookie = cookies.get('__session')?.value;
        
        if (!sessionCookie) {
            // No session cookie, redirect to login
            console.log(`[Auth Middleware] Blocking access to ${pathname} - No session cookie`);
            return redirect('/app/login');
        }

        // For admin routes, verify the user is an admin
        if (isAdminRoute) {
            try {
                console.log('[Auth Middleware] Checking admin access...');
                console.log('[Auth Middleware] Admin emails configured:', ADMIN_EMAILS);
                console.log('[Auth Middleware] Session cookie length:', sessionCookie.length);
                
                // Decode the session cookie to get user email
                // The session cookie is a JWT token from Firebase
                const parts = sessionCookie.split('.');
                if (parts.length !== 3) {
                    console.error('[Auth Middleware] Invalid JWT format - not 3 parts:', parts.length);
                    return redirect('/app/login');
                }
                
                const payload = JSON.parse(atob(parts[1]));
                console.log('[Auth Middleware] Decoded payload:', { 
                    email: payload.email, 
                    uid: payload.uid,
                    hasEmail: !!payload.email 
                });
                
                const userEmail = payload.email?.toLowerCase();

                if (!userEmail) {
                    console.log('[Auth Middleware] No email in token');
                    return redirect('/app/dashboard');
                }

                if (!ADMIN_EMAILS.includes(userEmail)) {
                    console.log(`[Auth Middleware] Blocking admin access - User ${userEmail} is not in admin list`);
                    console.log('[Auth Middleware] Admin list:', ADMIN_EMAILS);
                    return redirect('/app/dashboard');
                }

                console.log(`[Auth Middleware] ✓ Admin access granted to ${pathname} for ${userEmail}`);
            } catch (error) {
                console.error('[Auth Middleware] Error decoding session cookie:', error);
                return redirect('/app/login');
            }
        }

        // Optional: Verify the session cookie with Firebase Admin
        // For now, we trust the presence of the cookie
        // You can add Firebase Admin SDK verification here for production
    }

    return next();
});
