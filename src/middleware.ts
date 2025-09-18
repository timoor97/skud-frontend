import createMiddleware from 'next-intl/middleware';
// import { locales } from './i18n/routing';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { currentUserPermissionsActions } from './app/[locale]/actions/(users)/getCurrentUser';
import { PERMISSIONS } from './constants/permissions';

// import { cookies } from "next/headers"

const pagePermissions: { [key: string]: string[] } = {
    '/dashboard/users': [PERMISSIONS.VIEW_USERS],
    '/dashboard/roles': [PERMISSIONS.VIEW_ROLES],
    '/dashboard/activity-logs': [PERMISSIONS.VIEW_ACTIVITY_LOGS],
    '/dashboard/sign-in-logs': [PERMISSIONS.VIEW_SIGN_IN_LOGS],
};


export async function middleware(req: NextRequest) {
    const { url, cookies } = req;
    const token = cookies.get('token')?.value;
    const tokenExpiration = req.cookies.get('token_expiration')?.value;
    const pathname = req.nextUrl.pathname;

    // First, handle locale routing
    const localeCheck = createMiddleware(routing);
    const localeResponse = localeCheck(req);
    
    // Extract locale from the pathname
    const locale = pathname.split('/')[1] || 'en';

    if(Number(tokenExpiration) === 0) {
        const response = NextResponse.redirect(`/${locale}/login`);
        response.cookies.set('token', '', { maxAge: 0, path: '/' });
        response.cookies.set('token_expiration', '', { maxAge: 0, path: '/' });
        return response;
    }

    if (url.includes('/login') && token) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
    }

    if (url.includes('/dashboard') && !token) {
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
    }

    if (token) {
        try {
            const userPermissions = await currentUserPermissionsActions(locale)
            const normalizedPathname = pathname.replace(/^\/(ru|en|uz)/, '');
            const requiredPermissions = pagePermissions[normalizedPathname];
            if (requiredPermissions) {
                const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
                if (!hasPermission) {
                    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
                }
            }
        } catch (error) {
            // Handle 401 Unauthorized or any auth errors
            console.log('Authentication error in middleware:', error);
            
            // Clear the invalid tokens
            const response = NextResponse.redirect(new URL(`/${locale}/login`, req.url));
            response.cookies.set('token', '', { maxAge: 0, path: '/' });
            response.cookies.set('token_expiration', '', { maxAge: 0, path: '/' });
            
            return response;
        }
    }

    return localeResponse;
}


export const config = {
    matcher: [
        '/((?!api|_next|static|.*\\..*).*)',
        '/(en|ru|uz)/:path*',
    ],
};

