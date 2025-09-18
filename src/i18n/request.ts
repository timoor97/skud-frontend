// import { getRequestConfig } from 'next-intl/server';
// import { locales } from './routing';
//
// type Locale = typeof locales[number];
//
//
//
//
// export default getRequestConfig(async ({ locale }) => {
//
//     console.log(locale)
//
//     // This should only be called for valid locales due to middleware validation
//     const validLocale = locale && locales.includes(locale as Locale) ? locale : 'ru';
//
//     return {
//         locale: validLocale,
//         messages: (await import(`../../messages/${validLocale}.json`)).default
//     };
// });


import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});