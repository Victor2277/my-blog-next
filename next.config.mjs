/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pixnet.net',
      },
      {
        protocol: 'https',
        hostname: '**.pimg.tw',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all for flexibility with scraped content
      }
    ],
  },
};

export default nextConfig;
