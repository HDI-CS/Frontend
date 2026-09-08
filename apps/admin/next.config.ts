import { getApiOrigin } from '@hdi/next-config';
import type { NextConfig } from 'next';

// 로컬 개발(next dev)에서는 NODE_ENV가 자동으로 'development'가 되므로
// 로컬 백엔드로, 배포 빌드('next build')에서는 운영 API로 자동 전환된다.
// 예전처럼 destination을 손으로 주석 처리/해제하다가 운영 설정이
// 로컬용으로 그대로 커밋되는 사고를 막기 위함.
const API_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://api.hdi.ai.kr'
    : 'http://localhost:8080';

const nextConfig: NextConfig = {
  basePath: '/admin',
  assetPrefix: '/admin', // asset 경로가 깨지는 걸 방지

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
  // basePath('/admin')가 설정된 상태라 Next.js가 rewrite의 source에
  // 자동으로 '/admin'을 붙인다(공식 동작). 그래서 여기 source를
  // '/admin/api/:path*'라고 쓰면 실제로는 '/admin/admin/api/:path*'를
  // 매칭하게 되어, 브라우저가 실제로 보내는 '/admin/api/...' 요청과
  // 매칭되지 않고 404가 난다. source는 basePath 없이 '/api/:path*'로
  // 써야 한다.
  //
  // destination은 @hdi/next-config가 NODE_ENV 기준으로 로컬/운영을
  // 자동 전환해준다 (admin/web에서 손으로 값을 바꾸다 사고 나는 걸 방지).
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${getApiOrigin()}/:path*`,
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
