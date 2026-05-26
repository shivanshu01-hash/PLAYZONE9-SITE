// PostCSS Configuration — Fix #3 + Fix #4: PurgeCSS + CSSNano minification
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [
        './**/*.html',
        './**/*.js'
      ],
      safelist: {
        standard: [
          /^fa-/,
          /^fas-/,
          /^fab-/,
          /^far-/,
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
          'open','active','show','hidden','visible',
          'modal','modal-backdrop','fade',
          'login-page','login-box','img-fluid','card','card-body',
          'form-control','input-group','input-group-text',
          'btn','btn-primary','btn-block','btn-lg','btn-sm',
          'd-grid','forgot-font','recaptchaTerms','footer-login',
          'login-card',
          'pz-topnav','pz-topnav-inner','pz-topnav-logo','pz-topnav-links',
          'pz-hamburger','pz-footer','pz-footer-inner','pz-footer-top',
          'pz-footer-brand','pz-footer-links','pz-footer-bottom',
          'pz-footer-socials','pz-footer-toggle','pz-footer-email',
          'pz-page','pz-hero','pz-hero-content','pz-hero-badge',
          'pz-fade-in','pz-delay-1','pz-delay-2','pz-delay-3',
          'pz-cta-group','pz-btn','pz-btn-primary','pz-btn-outline',
          'pz-stats-row','pz-stat','pz-stat-number','pz-stat-label',
          'pz-section','pz-section-header','pz-section-divider',
          'pz-featured-grid','pz-featured-card','pz-featured-img',
          'pz-featured-body','pz-link-arrow','pz-trust-banner',
          'pz-animate','error-modal','whatsapp-widget','whatsapp-icon',
          'blink-message','grecaptcha-badge',
        ],
        variables: [/^--pz-/,/^--bg-/,/^--text-/]
      },
      keyframes: true,
      fontFace: true,
      rejected: false
    }),
    require('cssnano')({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        minifySelectors: true,
        minifyParams: true,
        mergeRules: true,
        reduceTransforms: true,
        discardUnused: true,
        discardDuplicates: true,
        discardOverridden: true
      }]
    })
  ]
};