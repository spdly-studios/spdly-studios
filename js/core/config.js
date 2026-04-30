/**
 * config.js — Global site configuration
 * Single source of truth for all site-wide constants.
 * Update values here and they propagate everywhere.
 */

const SITE_CONFIG = {
  // Brand & Identity
  siteName: 'SpDly Studios',
  author: 'Shivaprasad V',
  jobTitle: 'System Design Engineer',
  description: 'System Design Engineer specializing in Embedded Systems, Signal Processing, CubeSat ADCS, and Real-Time Systems. Explore advanced hardware-software projects and portfolio.',

  // Domain & URLs
  domain: 'spdly.is-a.dev',
  baseUrl: 'https://spdly.is-a.dev',
  homeUrl: 'https://spdly.is-a.dev/',
  workUrl: 'https://spdly.is-a.dev/work.html',  // project detail page

  // Social Media & Contact
  socialLinks: {
    github: {
      url: 'https://github.com/SpDly14',
      username: 'SpDly14',
      label: 'GitHub'
    },
    linkedin: {
      url: 'https://linkedin.com/in/spdly',
      username: 'spdly',
      label: 'LinkedIn'
    }
  },
  email: 'spdly.studios@gmail.com',

  // Assets (root-relative paths)
  assets: {
    ogImage: 'https://spdly.is-a.dev/assets/logo.svg',
    logo: 'https://spdly.is-a.dev/assets/logo.svg',
    profile: 'https://spdly.is-a.dev/assets/logo.svg',
    favicon: '/assets/logo.svg',
    appleTouchIcon: '/assets/logo.svg'
  },

  // SEO Keywords
  keywords: {
    primary: ['Embedded Systems', 'Signal Processing', 'CubeSat ADCS', 'Real-Time Systems', 'System Design'],
    secondary: ['Hardware Engineering', 'Software Engineering', 'Portfolio', 'Arduino', 'ESP32', 'embedded C', 'DSP', 'Digital Signal Processing'],
    full: 'Embedded Systems, Signal Processing, CubeSat ADCS, Real-Time Systems, System Design, Hardware Engineering, Software Engineering, Portfolio'
  },

  // OpenGraph
  ogType: 'website',
  ogImage: {
    url: 'https://spdly.is-a.dev/assets/logo.svg',
    width: 1200,
    height: 630,
    type: 'image/png'
  },

  // SEO Defaults
  seo: {
    robotsRules: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    revisitAfter: '7 days',
    language: 'en',
    locale: 'en_US',
    charset: 'UTF-8'
  },

  // Copyright
  copyright: {
    year: 2026,
    owner: 'Shivaprasad V',
    notice: '© 2026 Shivaprasad V. All rights reserved.'
  },

  // Sitemap entries
  pages: [
    { url: '/',          changefreq: 'monthly', priority: 1.0, lastmod: '2026-01-15' },
    { url: '/work.html', changefreq: 'weekly',  priority: 0.8, lastmod: '2026-01-15' }
  ],

  // Per-project SEO defaults
  workDefaults: {
    ogType: 'article',
    changefreq: 'monthly',
    priority: 0.7
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
