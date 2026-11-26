/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: Vercel serves plain files from /out, nothing runs on a server.
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  // Every picture is pre-sized to WebP by art/build_images.py.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
