/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : 'http://backend:5328/api/:path*',
      },
    ]
  },
  images: {
    domains: ['www.unica.fi'],
  }
}

module.exports = nextConfig
