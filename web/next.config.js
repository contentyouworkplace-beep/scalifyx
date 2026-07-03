const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/learn-seo',
        destination: '/special-audit',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
