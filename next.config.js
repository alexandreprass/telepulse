/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['@/lib'] = './lib';
    // Mockar módulos Node.js no cliente
    config.resolve.fallback = {
      fs: false,
      net: false,
    };
    return config;
  },
};

module.exports = nextConfig;
