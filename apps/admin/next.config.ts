import type { NextConfig } from 'next';
const ADMIN_APP_URL = process.env.ADMIN_APP_URL;

const nextConfig: NextConfig = {
  // basePath: '/admin',
  // assetPrefix: '/admin', 이미지/에셋 문제 생기면

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
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.hdi.ai.kr/:path*',
      },
      // {
      //   source: '/admin/:path*',
      //   destination: `${ADMIN_APP_URL}/admin/:path*`,
      // },
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
