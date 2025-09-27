import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Add support for dynamic domains from environment variables
      ...(process.env.NEXT_PUBLIC_BASE_URL ? [
        {
          protocol: process.env.NEXT_PUBLIC_BASE_URL.startsWith('https') ? 'https' : 'http',
          hostname: new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname,
          port: '',
          pathname: '/**',
        } as const
      ] : []),
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);