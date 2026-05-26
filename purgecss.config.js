// PurgeCSS Configuration — Fix #3: Eliminate 97.3% unused CSS (93 KiB savings)
// Run: npx purgecss --config purgecss.config.js
module.exports = {
  content: [
    './**/*.html',
    './**/*.js'
  ],
  css: [
    './PLAYZONE9_files/style.css',
    './PLAYZONE9_files/responsive.css',
    './PLAYZONE9_files/custom.css',
    './PLAYZONE9_files/bootstrap.min.css'
  ],
  // Preserve these selectors used dynamically by JS or critical for runtime
  safelist: {
    standard: [
      // Font Awesome icons used across the site
      /^fa-/,
      /^fas-/,
      /^fab-/,
      /^far-/,
      // Bootstrap utility classes used by JS or inline
      /^d-(flex|grid|block|none)/,
      /^flex-column/,
      /^align-items-center/,
      /^position-relative/,
      /^text-(center|end)/,
      /^mt-/,
      /^mb-/,
      /^ms-/,
      /^me-/,
      /^pt-/,
      /^pb-/,
      /^float-(start|end)/,
      /^w-/,
      /^h-/,
      /^font-/,
      /^fw-/,
      /^text-/,
      /^bg-/,
      // Dynamic toggle classes
      'open',
      'active',
      'show',
      'hidden',
      'visible',
      // Modal classes
      'modal',
      'modal-backdrop',
      'fade',
      // Login page critical
      'login-page',
      'login-box',
      'img-fluid',
      'card',
      'card-body',
      'form-control',
      'input-group',
      'input-group-text',
      'btn',
      'btn-primary',
      'btn-block',
      'btn-lg',
      'btn-sm',
      'd-grid',
      'forgot-font',
      'recaptchaTerms',
      'footer-login',
      // Custom login
      'login-card',
      // Shared navbar/footer
      'pz-topnav',
      'pz-topnav-inner',
      'pz-topnav-logo',
      'pz-topnav-links',
      'pz-hamburger',
      'pz-footer',
      'pz-footer-inner',
      'pz-footer-top',
      'pz-footer-brand',
      'pz-footer-links',
      'pz-footer-bottom',
      'pz-footer-socials',
      'pz-footer-toggle',
      'pz-footer-email',
      // Home page
      'pz-page',
      'pz-hero',
      'pz-hero-content',
      'pz-hero-badge',
      'pz-fade-in',
      'pz-delay-1',
      'pz-delay-2',
      'pz-delay-3',
      'pz-cta-group',
      'pz-btn',
      'pz-btn-primary',
      'pz-btn-outline',
      'pz-stats-row',
      'pz-stat',
      'pz-stat-number',
      'pz-stat-label',
      'pz-section',
      'pz-section-header',
      'pz-section-divider',
      'pz-featured-grid',
      'pz-featured-card',
      'pz-featured-img',
      'pz-featured-body',
      'pz-link-arrow',
      'pz-trust-banner',
      'pz-animate',
      // Error modal
      'error-modal',
      // WhatsApp widget
      'whatsapp-widget',
      'whatsapp-icon',
      // Custom CSS
      'blink-message',
      'grecaptcha-badge',
    ],
    // Preserve all CSS custom properties (root variables)
    variables: [
      /^--pz-/,
      /^--bg-/,
      /^--text-/,
    ]
  },
  // Don't purge keyframes/animations
  keyframes: true,
  fontFace: true,
  // Output to a separate purged directory
  output: './PLAYZONE9_files/purged/',
  rejected: false
};