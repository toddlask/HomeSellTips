// 'self' allows the Vercel Web Analytics script and page-view request at /_vercel/insights/*.
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagservices.com https://adservice.google.com https://www.google.com https://tpc.googlesyndication.com https://www.gstatic.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://www.gstatic.com https://ad.doubleclick.net https://*.googlesyndication.com",
  "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://csi.gstatic.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://*.adtrafficquality.google https://formsubmit.co",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com https://*.adtrafficquality.google",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

export const STATIC_IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";

export const GENERATED_OG_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800";

type ResponseHeader = {
  key: string;
  value: string;
};

type ResponseHeaderRule = {
  source: string;
  headers: ResponseHeader[];
};

const SECURITY_HEADERS: ResponseHeader[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
];

function cacheRule(source: string, value: string): ResponseHeaderRule {
  return { source, headers: [{ key: "Cache-Control", value }] };
}

export const STATIC_IMAGE_SOURCES = [
  "/photos/(.*)",
  "/og.png",
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
] as const;

export const GENERATED_OG_SOURCE = "/og/tips/(.*)";

export const NETLIFY_STATIC_IMAGE_PATHS = [
  "/photos/*",
  "/og.png",
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
] as const;

export const NETLIFY_GENERATED_OG_PATH = "/og/tips/*";

export const RESPONSE_HEADERS: ResponseHeaderRule[] = [
  { source: "/(.*)", headers: SECURITY_HEADERS },
  ...STATIC_IMAGE_SOURCES.map((source) => cacheRule(source, STATIC_IMAGE_CACHE_CONTROL)),
  cacheRule(GENERATED_OG_SOURCE, GENERATED_OG_CACHE_CONTROL),
];
