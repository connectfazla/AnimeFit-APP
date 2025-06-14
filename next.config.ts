
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dragonball.fandom.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com', // For Unsplash page links, direct images often on images.unsplash.com
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For direct Unsplash image files
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kimetsu-no-yaiba.fandom.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'attackontitan.fandom.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net', // Common CDN for Fandom images
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
