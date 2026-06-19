import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: "</.well-known/api-catalog>; rel=\"api-catalog\", </docs/api>; rel=\"service-doc\"",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
