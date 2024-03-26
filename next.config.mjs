/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/garmin-connect-prod/profile_images/**',
      },
    ],
  },
};

export default nextConfig;
