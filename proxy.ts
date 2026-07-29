// import { NextRequest, NextResponse } from 'next/server'
// import { verifyToken } from './lib/auth'

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname

//   // Public routes that don't require authentication
//   const publicRoutes = ['/login', '/api/auth/login']
  
//   // Check if the route is public
//   if (publicRoutes.includes(pathname)) {
//     // If user is already logged in and trying to access login, redirect to dashboard
//     const accessToken = request.cookies.get('accessToken')?.value
//     if (accessToken && pathname === '/login') {
//       return NextResponse.redirect(new URL('/dashboard', request.url))
//     }
//     return NextResponse.next()
//   }

//   // Protected routes - require authentication
//   const protectedRoutes = ['/dashboard', '/api/transactions', '/api/sse']
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

//   if (isProtectedRoute) {
//     const accessToken = request.cookies.get('accessToken')?.value

//     if (!accessToken) {
//       // No token, redirect to login
//       return NextResponse.redirect(new URL('/login', request.url))
//     }

//     // Verify token
//     const payload = verifyToken(accessToken)
//     if (!payload) {
//       // Invalid token, redirect to login
//       const response = NextResponse.redirect(new URL('/login', request.url))
//       response.cookies.delete('accessToken')
//       response.cookies.delete('refreshToken')
//       return response
//     }

//     // Check role-based access for admin-only routes
//     if (pathname.startsWith('/api/transactions/') && request.method !== 'GET') {
//       // Only admins can modify transactions
//       if (payload.role !== 'admin') {
//         return NextResponse.json(
//           { error: 'Unauthorized: Admin access required' },
//           { status: 403 }
//         )
//       }
//     }

//     // Token is valid, proceed
//     return NextResponse.next()
//   }

//   // Home page redirect
//   if (pathname === '/') {
//     const accessToken = request.cookies.get('accessToken')?.value
//     if (accessToken) {
//       return NextResponse.redirect(new URL('/dashboard', request.url))
//     }
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|icon\\.svg).*)',
//   ],
// }


// import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "./lib/jwt";
// import { ACCESS_COOKIE } from "./lib/constants";

// // Runs on the Edge runtime. Keep it lean: no DB, no next/headers, no Node APIs.
// export const config = {
//   matcher: ["/dashboard", "/dashboard/:path*"],
// };

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get(ACCESS_COOKIE)?.value;
//   const secret = process.env.AUTH_SECRET;

//   const loginUrl = new URL("/login", req.url);
//   loginUrl.searchParams.set("from", req.nextUrl.pathname);

//   // No cookie at all: straight to login.
//   if (!token || !secret) {
//     return NextResponse.redirect(loginUrl);
//   }

//   // Verify signature + expiry at the edge. This is a gate, not the security
//   // boundary (see README "Middleware limitations"): the Route Handlers verify
//   // again and are the real authority, since only they can check the DB, roles,
//   // and token revocation.
//   const claims = await verifyToken(token, secret);
//   if (!claims || claims.type !== "access") {
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }


import { NextRequest, NextResponse } from "next/server";
import { verifyToken, signToken } from "./lib/jwt";
import { ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_TTL } from "./lib/constants";

export const config = {
  // /login now goes through middleware too
  matcher: ["/", "/dashboard", "/dashboard/:path*", "/login"],
};

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};


export async function proxy(req: NextRequest) {
  // ...exact same body as the middleware function I gave you, just add:
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET;
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  let claims = accessToken && secret ? await verifyToken(accessToken, secret) : null;
  let mintedAccessToken: string | null = null;

  // Access token missing/expired, but a valid refresh token exists:
  // silently mint a new access token instead of bouncing to /login.
  if ((!claims || claims.type !== "access") && refreshToken && secret) {
    const refreshClaims = await verifyToken(refreshToken, secret);
    if (refreshClaims?.type === "refresh") {
      const now = Math.floor(Date.now() / 1000);
      mintedAccessToken = await signToken(
        { sub: refreshClaims.sub, role: refreshClaims.role, type: "access", exp: now + ACCESS_TTL },
        secret
      );
      claims = { ...refreshClaims, type: "access", exp: now + ACCESS_TTL };
    }
  }

  const isAuthed = !!claims && claims.type === "access";

  function finish(res: NextResponse) {
    if (mintedAccessToken) {
      res.cookies.set(ACCESS_COOKIE, mintedAccessToken, { ...cookieOpts, maxAge: ACCESS_TTL });
    }
    // Keep auth-gated pages out of the browser's bfcache so "back" always
    // re-runs middleware instead of restoring a stale in-memory page.
    res.headers.set("Cache-Control", "no-store, must-revalidate");
    return res;
  }

  if (pathname === "/") {
    const target = isAuthed ? "/dashboard" : "/login";
    return finish(NextResponse.redirect(new URL(target, req.url)));
  }

  if (pathname === "/login") {
    return isAuthed
      ? finish(NextResponse.redirect(new URL("/dashboard", req.url)))
      : finish(NextResponse.next());
  }

  // everything else matched here is /dashboard/*
  if (!isAuthed) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return finish(NextResponse.redirect(loginUrl));
  }

  return finish(NextResponse.next());
}