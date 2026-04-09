/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./content/oracle-knowledge/**/*"]
  },
  reactStrictMode: true
};

export default nextConfig;
