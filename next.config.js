/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wnnbkjlqmcphnpojtqkt.supabase.co"
      }
    ],
  },
};

module.exports = nextConfig;
