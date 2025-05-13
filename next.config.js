/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['@/lib'] = './lib';
    return config;
  },
};

module.exports = nextConfig;
