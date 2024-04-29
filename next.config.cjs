/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ['lofurazrorelmxjlqtdb.supabase.co'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          net: false,
          dns: false,
          tls: false,
          fs: false,
          path: false,
          crypto: false,
          request: false,
        },
      };
    }
    return config;
  },
}
