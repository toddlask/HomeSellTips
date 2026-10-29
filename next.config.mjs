/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/directory",
        destination: "/",
        permanent: true,
      },
      {
        source: "/archive",
        destination: "/tips",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
