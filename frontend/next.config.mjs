// next.config.mjs
import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
        exclude: /pdf\.worker\.min\.mjs/,
      }),
    ];
    return config;
  },
};

export default nextConfig;
