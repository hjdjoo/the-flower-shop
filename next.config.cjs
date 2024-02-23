/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lofurazrorelmxjlqtdb.supabase.co',
        pathname: '/storage/**'
      },
    ],
  },
}
