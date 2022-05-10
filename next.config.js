/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ytimg.com",
      "9b4b-2a02-14c-352-8700-c830-d2f7-2d2d-4d65.eu.ngrok.io",
    ],
  },
};

/*
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  style-src 'self';
  font-src 'self';  
`;
*/

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  /*
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },*/
];

module.exports = {
  ...nextConfig,

  async headers() {
    return [
      {
        // Force disable caching for any NextAuth api routes. We need to do this because by default
        // these API endpoints do not return a Cache-Control header. If the header is missing, FrontDoor
        // CDN **will** cache the pages, which is a security risk and can return the wrong user:
        // https://docs.microsoft.com/en-us/azure/frontdoor/front-door-caching#cache-expiration
        source: "/api/auth/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
