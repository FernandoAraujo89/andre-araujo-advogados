import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  /**
   * Redirects 301 das URLs do site antigo (Wix).
   * Funcionam em deploy com servidor (Vercel, Node). Para export estático
   * (`output: 'export'`), aplique os redirects no host — arquivos de exemplo
   * em redirects/ e instruções no README.
   */
  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({
      source: encodeURI(source),
      destination,
      statusCode: 301,
    }));
  },
};

export default nextConfig;
