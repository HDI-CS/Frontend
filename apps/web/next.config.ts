import type { NextConfig } from 'next';
const ADMIN_APP_URL = process.env.ADMIN_APP_URL;

console.log('ADMIN_APP_URL=', process.env.ADMIN_APP_URL);

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@hdi/ui', '@hdi/fonts'],
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
  // 개발 환경에서 API 프록시 설정 - 크로스 오리진 쿠키 문제 해결
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
  images: {
    remotePatterns: [
      new URL('https://hdi-s3.s3.ap-northeast-2.amazonaws.com/**'),
    ],
    unoptimized: true,
  },
};

export default nextConfig;
