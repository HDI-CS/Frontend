import type { NextConfig } from 'next';
const isDev = process.env.NODE_ENV === 'development';

const ADMIN_APP_URL = process.env.ADMIN_APP_URL;

const commonConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@hdi/ui', '@hdi/fonts'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdi-s3.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};
const redirectConfig: NextConfig = {
  async redirects() {
    return [
      // Auth redirect to root
      {
        source: '/',
        destination: '/auth',
        permanent: false,
      },
    ];
  },
};

const devConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
};
// 개발 환경에서 API 프록시 설정 - 크로스 오리진 쿠키 문제 해결
const prodConfig: NextConfig = {
  async rewrites() {
    if (!ADMIN_APP_URL) {
      console.warn('⚠️ ADMIN_APP_URL is not set');
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.hdi.ai.kr/:path*',
      },
      // admin API proxy
      {
        source: '/admin/api/:path*',
        destination: 'https://api.hdi.ai.kr/:path*',
      },
      {
        source: '/admin',
        destination: `${ADMIN_APP_URL}/admin`, // basePath 고려
      },
      {
        source: '/admin/:path*',
        destination: `${ADMIN_APP_URL}/admin/:path*`,
      },
    ];
  },
};

const nextConfig: NextConfig = {
  ...commonConfig,
  ...redirectConfig,
  ...(isDev ? devConfig : prodConfig),
};

export default nextConfig;
