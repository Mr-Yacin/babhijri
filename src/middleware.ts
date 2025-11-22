import { defineMiddleware } from 'astro:middleware';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
    '/app/dashboard',
    '/app/profile',
    '/app/settings',
    '/app/messages',
    '/app/admin'
];

// Public routes within /app that don't require auth
const PUBLIC_APP_ROUTES = [
    '/app',
    '/app/login',
    '/app/signup'
];

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect } = context;
    const pathname = url.pathname;

    // Check if this is a protected route
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );

    // Check if this is a public app route
    const isPublicAppRoute = PUBLIC_APP_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );

    if (isProtectedRoute && !isPublicAppRoute) {
        // Check for Firebase auth session cookie
        const sessionCookie = cookies.get('__session')?.value;
        
        if (!sessionCookie) {
            // No session cookie, redirect to login
            console.log(`[Auth Middleware] Blocking access to ${pathname} - No session cookie`);
            return redirect('/app/login');
        }

        // Optional: Verify the session cookie with Firebase Admin
        // For now, we trust the presence of the cookie
        // You can add Firebase Admin SDK verification here for production
    }

    return next();
});
