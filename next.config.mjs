import { withPayload } from '@payloadcms/next/withPayload'

// Resolve the R2 public URL into a `next/image` remote pattern. We only have
// one CDN host in this project (Cloudflare R2 public bucket), so a single
// derived entry keeps the config tight without hard-coding.
function r2RemotePattern() {
  const raw = process.env.S3_PUBLIC_URL
  if (!raw) return null
  try {
    const u = new URL(raw)
    return {
      protocol: u.protocol.replace(':', ''),
      hostname: u.hostname,
      pathname: '/**',
    }
  } catch {
    return null
  }
}

const remotePatterns = [
  { protocol: 'https', hostname: '**.r2.dev', pathname: '/**' },
  { protocol: 'https', hostname: '**.r2.cloudflarestorage.com', pathname: '/**' },
]

const fromEnv = r2RemotePattern()
if (fromEnv) remotePatterns.push(fromEnv)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns,
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 128, 256, 384, 512, 768],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}

export default withPayload(nextConfig)
