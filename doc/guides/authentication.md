# Authentication Guide

## Overview

This application uses Firebase Authentication with server-side session management for secure user authentication and authorization.

## Authentication Flow

### Login Process
1. User submits credentials via login form
2. Firebase authenticates the user
3. ID token is obtained from Firebase
4. Session cookie is created via `/api/auth/session`
5. User is redirected to dashboard

### Signup Process
1. User creates account with email and password
2. Firebase creates the user account
3. User profile is created in Firestore
4. ID token is obtained and session cookie is set
5. User is redirected to dashboard

### Logout Process
1. Session cookie is cleared via DELETE request to `/api/auth/session`
2. Firebase sign-out is called
3. User is redirected to homepage

## Protected Routes

The following routes require authentication:
- `/app/dashboard` - User dashboard
- `/app/profile` - Profile management
- `/app/settings` - User settings
- `/app/messages` - Messaging system
- `/app/admin` - Admin panel (requires admin role)

## Public Routes

These routes are accessible without authentication:
- `/app` - Browse profiles (with blur effect for non-authenticated users)
- `/app/login` - Login page
- `/app/signup` - Signup page

## Security Features

### Server-Side Protection
- Middleware checks authentication before rendering protected pages
- Session cookies are validated server-side
- No content is exposed before authentication check

### Client-Side Protection
- Auth state is managed via Svelte stores
- Logged-in users are automatically redirected from login/signup pages
- Loading states prevent content flash during auth checks

### Role-Based Access Control
- User roles are stored in Firestore
- Admin routes verify role before granting access
- Role changes require admin privileges

## Session Management

Session cookies are:
- HTTP-only for security
- Set with appropriate expiration
- Cleared on logout
- Validated on each protected route access

## Implementation Files

- `src/middleware.ts` - Server-side authentication middleware
- `src/pages/api/auth/session.ts` - Session cookie management API
- `src/lib/stores/auth.ts` - Client-side auth state management
- `src/lib/services/auth.ts` - Firebase authentication service
