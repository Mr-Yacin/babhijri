import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return new Response(JSON.stringify({ error: 'No token provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Set session cookie with the ID token
        // In production, you should verify this token with Firebase Admin SDK
        // For now, we'll store it as-is
        cookies.set('__session', idToken, {
            path: '/',
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 5 // 5 days
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Session creation error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create session' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const DELETE: APIRoute = async ({ cookies }) => {
    // Clear session cookie on logout
    cookies.delete('__session', {
        path: '/'
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
