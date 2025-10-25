// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/admin', destination: '/adm1ns', permanent: false },
      { source: '/admin/:path*', destination: '/adm1ns/:path*', permanent: false },
    ];
  },
};

export default nextConfig;
