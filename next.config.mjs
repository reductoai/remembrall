import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["shiki", "vscode-oniguruma", "canvas"],
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  webpack: (config, { webpack }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });
    // config.plugins.push(
    //   new webpack.ProvidePlugin({
    //     Buffer: ["buffer", "Buffer"],
    //     process: "process/browser",
    //   })
    // );
    return config;
  },

  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/openai/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};
export default config;
