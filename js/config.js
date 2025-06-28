/**
 * Configuration Module - Clean Version
 * Contains all configuration settings, constants, and environment variables
 */

const CONFIG = {
  // Application Settings
  app: {
    name: 'Eliud Waititu Portfolio',
    version: '2.0.0',
    description: 'Professional Web Developer & Designer Portfolio',
    author: 'Eliud Waititu',
    url: 'https://yourportfolio.com',
    email: 'contact@yourportfolio.com'
  },

  // Theme Configuration
  theme: {
    default: 'dark',
    storageKey: 'theme',
    timestampKey: 'theme-timestamp',
    transitionDuration: 300,
    supportSystemTheme: true
  },

  // Navigation Configuration
  navigation: {
    scrollThreshold: 50,
    mobileBreakpoint: 768,
    animationDuration: 300,
    autoClose: true,
    keyboardNavigation: true
  },

  // Scroll to Top Configuration
  scrollToTop: {
    showThreshold: 300,
    animationDuration: 600,
    enableProgressRing: true,
    enableKeyboardShortcuts: true,
    throttleDelay: 10
  },

  // UI Interactions Configuration
  ui: {
    enableAnimations: true,
    enableParallax: true,
    enableRippleEffects: true,
    animationDelay: 200,
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -50px 0px'
  },

  // Contact Information
  contact: {
    phone: '+254719790026',
    whatsapp: '+254719790026',
    email: 'contact@yourportfolio.com',
    location: 'Ruiru, Kiambu County, KE',
    timezone: 'Africa/Nairobi',
    
    social: {
      linkedin: 'https://www.linkedin.com/in/eliud-gachuki-278aa52aa',
      github: 'https://github.com/Eliudgt3rs',
      youtube: 'https://www.youtube.com/@drwebkenya',
      twitter: '',
      instagram: '',
      facebook: ''
    }
  },

  // WhatsApp Configuration
  whatsapp: {
    number: '+254719790026',
    defaultMessage: 'Hi Eliud, I checked your portfolio and I\'m interested in your web development services!',
    enableFloat: true
  },

  // Feature Flags
  features: {
    enableDarkMode: true,
    enableMobileMenu: true,
    enableScrollToTop: true,
    enableContactModal: true,
    enableImageLazyLoading: true
  },

  // SEO Configuration
  seo: {
    enableStructuredData: true,
    enableOpenGraph: true,
    enableTwitterCards: true,
    sitemap: '/sitemap.xml',
    robotsTxt: '/robots.txt'
  },

  // Analytics Configuration
  analytics: {
    enabled: false,
    googleAnalyticsId: '',
    trackingEvents: {
      pageViews: true,
      downloads: true,
      externalLinks: true,
      socialClicks: true
    }
  }
};

// Utility Functions
const ConfigUtils = {
  get(path, defaultValue = null) {
    return path.split('.').reduce((obj, key) => {
      return (obj && obj[key] !== undefined) ? obj[key] : defaultValue;
    }, CONFIG);
  },

  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!(key in obj)) obj[key] = {};
      return obj[key];
    }, CONFIG);
    target[lastKey] = value;
  },

  isFeatureEnabled(feature) {
    return this.get(`features.${feature}`, false);
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, ConfigUtils };
} else {
  window.CONFIG = CONFIG;
  window.ConfigUtils = ConfigUtils;
}

console.log('⚙️ Configuration loaded successfully');