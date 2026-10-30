/** Image processing — shared between vite-imagetools, image.server.ts, and NetlifyImage. */

/** Source widths for responsive srcsets, used by both the Vite ?picture pipeline and NetlifyImage. */
export const imageWidths = [400, 800, 1200, 1600, 2400] as const

/**
 * Formats emitted by the ?picture pipeline, in <source> order (fallback is the last).
 * No PNG: browsers take the AVIF or WebP, which keep transparency, and a PNG of
 * every photo at every width added ~400 MB to the build.
 */
export const imageFormats = ['avif', 'webp', 'jpeg'] as const

/** Quality for optimized images (meta image and Netlify CDN). */
export const imageQuality = 80

/** Width of the social/SEO meta image (single downscaled JPEG). */
export const metaImageWidth = 1200
