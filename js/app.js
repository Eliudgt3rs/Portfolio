/**
 * Main Application Module
 * Coordinates all modules and handles application initialization
 */

class App {
  constructor() {
    this.modules = new Map();
    this.isInitialized = false;
    this.config = {
      debug: false,
      performance: true,
      animations: true
    };
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.showLoadingState();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  /**
   * Handle DOM ready state
   */
  onDOMReady() {
    this.registerModules();
    this.setupGlobalEventListeners();
    this.initializeModules();
    this.hideLoadingState();
    this.runPostInitTasks();
    
    this.isInitialized = true;
    
    this.log('🎯 Application initialized successfully!');
    this.displayWelcomeMessage();
  }

  /**
   * Register all application modules
   */
  registerModules() {
    // Modules are auto-registered through their constructors
    // This method serves as a registry for potential future modules
    const moduleList = [
      'themeManager',
      'navigation', 
      'scrollToTop',
      'uiInteractions'
    ];

    moduleList.forEach(moduleName => {
      if (window[moduleName]) {
        this.modules.set(moduleName, window[moduleName]);
        this.log(`📦 Module registered: ${moduleName}`);
      }
    });
  }

  /**
   * Initialize all modules
   */
  initializeModules() {
    // Modules are already initialized through their constructors
    // This method can be used for any cross-module coordination
    
    this.setupModuleCommunication();
  }

  /**
   * Setup communication between modules
   */
  setupModuleCommunication() {
    // Theme changes affecting other modules
    window.addEventListener('themeChanged', (e) => {
      this.log(`🎨 Theme changed to: ${e.detail.theme}`);
      
      // Notify other modules if needed
      this.modules.forEach((module, name) => {
        if (module.onThemeChanged && typeof module.onThemeChanged === 'function') {
          module.onThemeChanged(e.detail.theme);
        }
      });
    });

    // Navigation state changes
    window.addEventListener('navigationStateChanged', (e) => {
      this.log(`🧭 Navigation state changed: ${JSON.stringify(e.detail)}`);
    });
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Global error handling
    window.addEventListener('error', (e) => {
      console.error('Global error caught:', e.error);
      this.handleError(e.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.handleError(e.reason);
    });

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.onPageHidden();
      } else {
        this.onPageVisible();
      }
    });

    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.onWindowResize(), 250);
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.onBeforeUnload();
    });
  }

  /**
   * Handle page hidden
   */
  onPageHidden() {
    this.log('👁️ Page hidden');
    // Pause animations, save state, etc.
  }

  /**
   * Handle page visible
   */
  onPageVisible() {
    this.log('👁️ Page visible');
    // Resume animations, refresh data, etc.
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    this.log('📐 Window resized');
    
    // Notify modules of resize
    this.modules.forEach((module, name) => {
      if (module.onResize && typeof module.onResize === 'function') {
        module.onResize();
      }
    });
  }

  /**
   * Handle before unload
   */
  onBeforeUnload() {
    this.log('👋 Page unloading');
    
    // Cleanup modules
    this.modules.forEach((module, name) => {
      if (module.destroy && typeof module.destroy === 'function') {
        module.destroy();
      }
    });
  }

  /**
   * Run post-initialization tasks
   */
  runPostInitTasks() {
    // Performance monitoring
    if (this.config.performance) {
      this.monitorPerformance();
    }

    // Accessibility enhancements
    this.enhanceAccessibility();

    // SEO optimizations
    this.optimizeSEO();

    // Analytics initialization (if needed)
    this.initializeAnalytics();
  }

  /**
   * Monitor performance
   */
  monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            this.log(`⚡ Page load time: ${Math.round(navigation.loadEventEnd - navigation.fetchStart)}ms`);
          }

          // Monitor resource loading
          const resources = performance.getEntriesByType('resource');
          const slowResources = resources.filter(resource => resource.duration > 1000);
          
          if (slowResources.length > 0) {
            this.log(`🐌 Slow resources detected: ${slowResources.length}`);
          }
        }, 0);
      });
    }
  }

  /**
   * Enhance accessibility
   */
  enhanceAccessibility() {
    // Add skip navigation link
    this.addSkipNavigation();

    // Improve focus management
    this.improveFocusManagement();

    // Add ARIA labels where missing
    this.addMissingAriaLabels();
  }

  /**
   * Add skip navigation link
   */
  addSkipNavigation() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-navigation';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--card-bg);
      color: var(--text-primary);
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Improve focus management
   */
  improveFocusManagement() {
    // Add focus indicators for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible:focus {
        outline: 2px solid #1e30f3;
        outline-offset: 2px;
      }
      
      .btn-enhanced:focus-visible {
        box-shadow: 0 0 0 3px rgba(30, 48, 243, 0.3);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add missing ARIA labels
   */
  addMissingAriaLabels() {
    // Add aria-label to buttons without text
    const iconButtons = document.querySelectorAll('button:not([aria-label])');
    iconButtons.forEach(button => {
      const icon = button.querySelector('i');
      if (icon && !button.textContent.trim()) {
        const classes = icon.className;
        let label = 'Button';
        
        if (classes.includes('bi-house')) label = 'Home';
        else if (classes.includes('bi-telephone')) label = 'Call';
        else if (classes.includes('bi-envelope')) label = 'Contact';
        
        button.setAttribute('aria-label', label);
      }
    });
  }

  /**
   * Optimize SEO
   */
  optimizeSEO() {
    // Add structured data
    this.addStructuredData();

    // Optimize meta tags
    this.optimizeMetaTags();
  }

  /**
   * Add structured data
   */
  addStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Eliud Waititu",
      "jobTitle": "Web Developer",
      "description": "Professional Web Developer & Designer",
      "url": window.location.origin,
      "sameAs": [
        "https://www.linkedin.com/in/eliud-gachuki-278aa52aa",
        "https://github.com/Eliudgt3rs",
        "https://www.youtube.com/@drwebkenya"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Optimize meta tags
   */
  optimizeMetaTags() {
    // Add Open Graph tags if missing
    const ogTags = [
      { property: 'og:title', content: 'Eliud Waititu - Professional Web Developer' },
      { property: 'og:description', content: 'Professional Web Developer & Designer helping brands grow online' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href }
    ];

    ogTags.forEach(tag => {
      if (!document.querySelector(`meta[property="${tag.property}"]`)) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });
  }

  /**
   * Initialize analytics (placeholder)
   */
  initializeAnalytics() {
    // Placeholder for analytics initialization
    // Could integrate Google Analytics, Mixpanel, etc.
    this.log('📊 Analytics placeholder initialized');
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  }

  /**
   * Display welcome message in console
   */
  displayWelcomeMessage() {
    if (this.config.debug) {
      console.group('🎨 Eliud Waititu Portfolio');
      console.log('%cWelcome to my portfolio! 🚀', 'color: #1e30f3; font-size: 16px; font-weight: bold;');
      console.log('%cFeel free to explore and contact me for web development projects!', 'color: #e21e80; font-size: 12px;');
      console.log('%cBuilt with modern web technologies and best practices.', 'color: #667eea; font-size: 10px;');
      console.groupEnd();
    }
  }

  /**
   * Handle errors gracefully
   * @param {Error} error 
   */
  handleError(error) {
    console.error('Application error:', error);
    
    // Could send error to monitoring service
    // this.sendErrorToMonitoring(error);
  }

  /**
   * Log messages with timestamp
   * @param {string} message 
   */
  log(message) {
    if (this.config.debug) {
      const timestamp = new Date().toISOString().substr(11, 8);
      console.log(`[${timestamp}] ${message}`);
    }
  }

  /**
   * Get application state
   * @returns {Object}
   */
  getState() {
    const moduleStates = {};
    this.modules.forEach((module, name) => {
      if (module.getState && typeof module.getState === 'function') {
        moduleStates[name] = module.getState();
      }
    });

    return {
      isInitialized: this.isInitialized,
      config: this.config,
      modules: moduleStates,
      performance: this.getPerformanceData()
    };
  }

  /**
   * Get performance data
   * @returns {Object}
   */
  getPerformanceData() {
    if (!('performance' in window)) return null;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) return null;

    return {
      loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
      firstPaint: this.getFirstPaint(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * Get first paint timing
   * @returns {number|null}
   */
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
  }

  /**
   * Get memory usage
   * @returns {Object|null}
   */
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  /**
   * Enable debug mode
   */
  enableDebug() {
    this.config.debug = true;
    console.log('🐛 Debug mode enabled');
  }

  /**
   * Disable debug mode
   */
  disableDebug() {
    this.config.debug = false;
  }

  /**
   * Get module by name
   * @param {string} name 
   * @returns {Object|null}
   */
  getModule(name) {
    return this.modules.get(name) || null;
  }

  /**
   * Restart application
   */
  restart() {
    this.log('🔄 Restarting application...');
    
    // Cleanup
    this.modules.forEach((module, name) => {
      if (module.destroy && typeof module.destroy === 'function') {
        module.destroy();
      }
    });
    
    // Reinitialize
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}

// Initialize application
window.app = new App();

// Global utilities
window.appUtils = {
  getState: () => window.app.getState(),
  enableDebug: () => window.app.enableDebug(),
  disableDebug: () => window.app.disableDebug(),
  restart: () => window.app.restart(),
  getModule: (name) => window.app.getModule(name)
};