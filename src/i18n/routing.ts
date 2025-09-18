// import { createNavigation } from 'next-intl/navigation';
//
// export const locales = ['uz', 'en', 'ru'] as const;
// export const localePrefix = 'always';
//
// export const { Link, redirect, usePathname, useRouter } =
//     createNavigation({ locales, localePrefix });



import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['uz', 'en', 'ru'],

    // Used when no locale matches
    defaultLocale: 'uz'
});