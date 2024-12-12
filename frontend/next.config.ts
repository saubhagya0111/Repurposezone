import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    domains: ['pbs.twimg.com', 'your-other-allowed-domain.com'], // Add allowed domains here
  },
};

export default nextConfig;
