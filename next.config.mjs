/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL;

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
