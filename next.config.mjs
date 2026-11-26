/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: Vercel serves plain files from /out, nothing runs on a server.
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  // lets a phone on the same Wi-Fi load the dev server
  allowedDevOrigins: ["192.168.1.9"],
  // Every picture is pre-sized to WebP by art/build_images.py.
  images: { unoptimized: true },
};

export default nextConfig;
