import type { NextConfig } from 'next';
const ADMIN_APP_URL = process.env.ADMIN_APP_URL;

console.log('ADMIN_APP_URL=', process.env.ADMIN_APP_URL);

// 로컬 개발(next dev)에서는 NODE_ENV가 자동으로 'development'가 되므로
// 로컬 백엔드로, 배포 빌드('next build')에서는 운영 API로 자동 전환된다.
// 예전처럼 destination을 손으로 주석 처리/해제하다가 운영 설정이
// 로컬용으로 그대로 커밋되는 사고를 막기 위함.
const API_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://api.hdi.ai.kr'
    : 'http://localhost:8080';

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
        destination: `${API_ORIGIN}/:path*`,
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
