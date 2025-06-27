/**
 * SEO Manager Module
 * Handles dynamic SEO optimization, structured data, and meta tags
 */

class SEOManager {
  constructor() {
    this.config = window.CONFIG || {};
    this.currentPage = this.getCurrentPage();
    
    this.init();
  }

  /**
   * Initialize SEO manager
   */
  init() {
    this.updateMetaTags();
    this.addStructuredData();
    this.addOpenGraphTags();
    this.addTwitterCards();
    this.optimizeImages();
    this.addCanonicalURL();
    this.setupAnalytics();
    
    console.log('🔍 SEO Manager initialized');
  }

  /**
   * Get current page information
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    const pageData = {
      'index.html': {
        title: 'Eliud Waititu - Professional Web Developer & Designer',
        description: 'Professional web developer and designer helping businesses grow online. Specializing in modern, responsive websites and digital solutions.',
        keywords: 'web developer, web design, frontend developer, portfolio, Eliud Waititu, responsive design, javascript developer',
        type: 'website'
      },
      'resume.html': {
        title: 'Resume - Eliud Waititu | Web Developer',
        description: 'Professional resume and work experience of Eliud Waititu, web developer with expertise in modern web technologies.',
        keywords: 'resume, CV, web developer experience, skills, qualifications, Eliud Waititu',
        type: 'profile'
      },
      'projects.html': {
        title: 'Projects Portfolio - Eliud Waititu | Web Developer',
        description: 'Showcase of web development projects, websites, and applications built by Eliud Waititu.',
        keywords: 'web development projects, portfolio showcase, websites, applications, case studies',
        type: 'website'
      },
      'contact.html': {
        title: 'Contact - Eliud Waititu | Web Developer',
        description: 'Get in touch with Eliud Waititu for web development services, project collaboration, or business inquiries.',
        keywords: 'contact web developer, hire developer, web development services, project inquiry',
        type: 'website'
      }
    };

    return pageData[page] || pageData['index.html'];
  }

  /**
   * Update meta tags dynamically
   */
  updateMetaTags() {
    const page = this.currentPage;
    
    // Update title
    document.title = page.title;
    
    // Update or create meta tags
    this.setMetaTag('description', page.description);
    this.setMetaTag('keywords', page.keywords);
    this.setMetaTag('author', 'Eliud Waititu');
    this.setMetaTag('robots', 'index, follow');
    this.setMetaTag('language', 'English');
    this.setMetaTag('revisit-after', '7 days');
    
    // Viewport (if not already set)
    this.setMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no');
    
    // Theme color for mobile browsers
    this.setMetaTag('theme-color', '#1e30f3');
    this.setMetaTag('msapplication-TileColor', '#1e30f3');
    
    // Prevent duplicate content
    this.setMetaTag('canonical', window.location.href);
  }

  /**
   * Set or update meta tag
   */
  setMetaTag(name, content, property = false) {
    const attribute = property ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }

  /**
   * Add canonical URL
   */
  addCanonicalURL() {
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    
    canonical.setAttribute('href', window.location.href);
  }

  /**
   * Add structured data (JSON-LD)
   */
  addStructuredData() {
    const structuredData = this.generateStructuredData();
    
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Generate structured data based on page type
   */
  generateStructuredData() {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Eliud Waititu",
      "jobTitle": "Web Developer",
      "description": "Professional Web Developer & Designer",
      "url": window.location.origin,
      "image": `${window.location.origin}/assets/images/profile.jpg`,
      "email": "mailto:eliudgachuki130@gmail.com", // Update with actual email
      "telephone": "+254719790026",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ruiru",
        "addressRegion": "Kiambu County",
        "addressCountry": "KE"
      },
      "sameAs": [
        "https://www.linkedin.com/in/eliud-gachuki-278aa52aa",
        "https://github.com/Eliudgt3rs",
        "https://www.youtube.com/@drwebkenya"
      ],
      "knowsAbout": [
        "Web Development",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Responsive Design",
        "Frontend Development",
        "UI/UX Design"
      ],
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Kenyatta University" // Update with actual education
      }
    };

    // Add page-specific structured data
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('projects')) {
      baseData["@type"] = ["Person", "CreativeWork"];
      baseData.workExample = this.getProjectsStructuredData();
    }
    
    if (currentPath.includes('resume')) {
      baseData.hasOccupation = {
        "@type": "Occupation",
        "name": "Web Developer",
        "description": "Frontend and fullstack web development",
        "estimatedSalary": {
          "@type": "MonetaryAmountDistribution",
          "name": "base",
          "currency": "USD"
        }
      };
    }

    return baseData;
  }

  /**
   * Get projects structured data
   */
  getProjectsStructuredData() {
    return [
      {
        "@type": "WebSite",
        "name": "Portfolio Project 1",
        "description": "Description of your project",
        "url": "project-url",
        "creator": {
          "@type": "Person",
          "name": "Eliud Waititu"
        }
      }
      // Add more projects here
    ];
  }

  /**
   * Add Open Graph tags for social media
   */
  addOpenGraphTags() {
    const page = this.currentPage;
    const baseURL = window.location.origin;
    
    const ogTags = {
      'og:title': page.title,
      'og:description': page.description,
      'og:type': page.type,
      'og:url': window.location.href,
      'og:site_name': 'Eliud Waititu Portfolio',
      'og:image': `${baseURL}/assets/images/og-image.jpg`, // Create this image
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': 'Eliud Waititu - Web Developer Portfolio',
      'og:locale': 'en_US',
      'article:author': 'Eliud Waititu'
    };

    // Add Facebook App ID if you have one
    // ogTags['fb:app_id'] = 'your-facebook-app-id';

    Object.entries(ogTags).forEach(([property, content]) => {
      this.setMetaTag(property, content, true);
    });
  }

  /**
   * Add Twitter Card tags
   */
  addTwitterCards() {
    const page = this.currentPage;
    const baseURL = window.location.origin;
    
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@yourtwitterhandle', // Update with your Twitter handle
      'twitter:creator': '@yourtwitterhandle',
      'twitter:title': page.title,
      'twitter:description': page.description,
      'twitter:image': `${baseURL}/assets/images/twitter-card.jpg`, // Create this image
      'twitter:image:alt': 'Eliud Waititu - Web Developer Portfolio'
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      this.setMetaTag(name, content);
    });
  }

  /**
   * Optimize images for SEO
   */
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add alt text if missing
      if (!img.alt || img.alt.trim() === '') {
        const src = img.src;
        const filename = src.split('/').pop().split('.')[0];
        img.alt = `Image: ${filename.replace(/[-_]/g, ' ')}`;
      }
      
      // Add loading="lazy" for performance
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  /**
   * Setup analytics tracking
   */
  setupAnalytics() {
    const config = this.config;
    
    // Google Analytics 4
    if (config.analytics?.enabled && config.analytics?.googleAnalyticsId) {
      this.loadGoogleAnalytics(config.analytics.googleAnalyticsId);
    }
    
    // Track page views
    this.trackPageView();
    
    // Track events
    this.setupEventTracking();
  }

  /**
   * Load Google Analytics
   */
  loadGoogleAnalytics(trackingId) {
    // Load gtag script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);
    
    // Initialize gtag
    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);
    
    window.gtag = window.gtag || function(){dataLayer.push(arguments);};
  }

  /**
   * Track page view
   */
  trackPageView() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  /**
   * Setup event tracking
   */
  setupEventTracking() {
    // Track external links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.hostname !== window.location.hostname) {
        this.trackEvent('click', 'external_link', link.href);
      }
    });

    // Track downloads
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href.match(/\.(pdf|doc|docx|zip|exe|dmg)$/i)) {
        this.trackEvent('download', 'file', link.href);
      }
    });

    // Track social clicks
    document.querySelectorAll('.social-links a').forEach(link => {
      link.addEventListener('click', () => {
        const platform = this.getSocialPlatform(link.href);
        this.trackEvent('click', 'social', platform);
      });
    });

    // Track contact interactions
    const contactButtons = document.querySelectorAll('[data-track="contact"]');
    contactButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.trackEvent('engagement', 'contact', 'button_click');
      });
    });
  }

  /**
   * Track custom events
   */
  trackEvent(action, category, label = '', value = 0) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
    
    console.log(`SEO: Event tracked - ${action}:${category}:${label}`);
  }

  /**
   * Get social platform from URL
   */
  getSocialPlatform(url) {
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('youtube.com')) return 'YouTube';
    if (url.includes('twitter.com')) return 'Twitter';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('instagram.com')) return 'Instagram';
    return 'Other';
  }

  /**
   * Generate and submit sitemap
   */
  generateSitemap() {
    const pages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/resume.html', priority: '0.8', changefreq: 'monthly' },
      { url: '/projects.html', priority: '0.9', changefreq: 'weekly' },
      { url: '/contact.html', priority: '0.7', changefreq: 'monthly' }
    ];

    const baseURL = window.location.origin;
    const lastmod = new Date().toISOString().split('T')[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    pages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseURL}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    return sitemap;
  }

  /**
   * Check SEO health
   */
  checkSEOHealth() {
    const checks = {
      title: document.title && document.title.length > 0 && document.title.length <= 60,
      description: document.querySelector('meta[name="description"]')?.content?.length <= 160,
      h1: document.querySelectorAll('h1').length === 1,
      images: Array.from(document.querySelectorAll('img')).every(img => img.alt),
      canonical: document.querySelector('link[rel="canonical"]') !== null,
      structuredData: document.querySelector('script[type="application/ld+json"]') !== null,
      openGraph: document.querySelector('meta[property="og:title"]') !== null,
      robots: document.querySelector('meta[name="robots"]') !== null
    };

    const score = Object.values(checks).filter(Boolean).length / Object.keys(checks).length * 100;
    
    console.log(`SEO Health Score: ${score.toFixed(0)}%`, checks);
    return { score, checks };
  }

  /**
   * Get SEO recommendations
   */
  getSEORecommendations() {
    const health = this.checkSEOHealth();
    const recommendations = [];

    if (!health.checks.title) {
      recommendations.push('Add a unique, descriptive title tag (50-60 characters)');
    }

    if (!health.checks.description) {
      recommendations.push('Add a meta description (150-160 characters)');
    }

    if (!health.checks.h1) {
      recommendations.push('Use exactly one H1 tag per page');
    }

    if (!health.checks.images) {
      recommendations.push('Add alt text to all images');
    }

    if (!health.checks.canonical) {
      recommendations.push('Add canonical URL to prevent duplicate content');
    }

    return recommendations;
  }
}

// Initialize SEO Manager
window.seoManager = new SEOManager();

// Export for external use
window.SEOUtils = {
  trackEvent: (action, category, label, value) => window.seoManager.trackEvent(action, category, label, value),
  checkHealth: () => window.seoManager.checkSEOHealth(),
  getRecommendations: () => window.seoManager.getSEORecommendations(),
  generateSitemap: () => window.seoManager.generateSitemap()
};