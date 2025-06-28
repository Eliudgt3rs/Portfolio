/**
 * Scroll To Top Module
 * Handles scroll-to-top button functionality with progress indicator
 */

class ScrollToTop {
  constructor() {
    this.button = null;
    this.showThreshold = 300;
    this.isVisible = false;
    this.isAnimating = false;
    this.scrollTimeout = null;
    
    this.init();
  }

  /**
   * Initialize scroll-to-top functionality
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.setupIntersectionObserver();
    this.update(); // Initial state
    
    console.log('🚀 Scroll to Top initialized');
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.button = document.getElementById('scrollToTopBtn');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (!this.button) return;

    // Click event
    this.button.addEventListener('click', () => this.scrollToTop());

    // Keyboard events
    this.button.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Touch events for mobile
    this.button.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.button.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    // Throttled scroll event for performance
    window.addEventListener('scroll', () => this.throttledUpdate());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));
  }

  /**
   * Handle button keyboard events
   * @param {KeyboardEvent} event 
   */
  handleKeyboard(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.scrollToTop();
    }
  }

  /**
   * Handle global keyboard shortcuts
   * @param {KeyboardEvent} event 
   */
  handleGlobalKeyboard(event) {
    // Ctrl + Home to scroll to top
    if (event.ctrlKey && event.key === 'Home') {
      event.preventDefault();
      this.scrollToTop();
    }

    // Alt + T for scroll to top (alternative shortcut)
    if (event.altKey && event.key === 't') {
      event.preventDefault();
      this.scrollToTop();
    }
  }

  /**
   * Handle touch start for mobile
   * @param {TouchEvent} event 
   */
  handleTouchStart(event) {
    event.preventDefault();
    if (this.button) {
      this.button.style.transform = 'scale(0.95)';
    }
  }

  /**
   * Handle touch end for mobile
   * @param {TouchEvent} event 
   */
  handleTouchEnd(event) {
    event.preventDefault();
    if (this.button) {
      this.button.style.transform = 'scale(1)';
      this.scrollToTop();
    }
  }

  /**
   * Throttled update for performance
   */
  throttledUpdate() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => this.update(), 10);
  }

  /**
   * Update button visibility and progress
   */
  update() {
    if (!this.button) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
    const scrollDegrees = (scrollPercent / 100) * 360;

    // Update progress ring
    this.button.style.setProperty('--scroll-progress', `${scrollDegrees}deg`);

    // Show/hide button
    const shouldShow = scrollTop > this.showThreshold;
    
    if (shouldShow && !this.isVisible) {
      this.show();
    } else if (!shouldShow && this.isVisible) {
      this.hide();
    }
  }

  /**
   * Show the scroll-to-top button
   */
  show() {
    if (!this.button || this.isVisible) return;

    this.button.classList.add('show');
    this.isVisible = true;
  }

  /**
   * Hide the scroll-to-top button
   */
  hide() {
    if (!this.button || !this.isVisible) return;

    this.button.classList.remove('show');
    this.isVisible = false;
  }

  /**
   * Scroll to top with animation
   */
  scrollToTop() {
    if (this.isAnimating || !this.button) return;

    // Add bounce animation
    this.button.classList.add('animate');
    this.isAnimating = true;

    // Smooth scroll to top
    this.performScroll();

    // Remove animation class after animation completes
    setTimeout(() => {
      if (this.button) {
        this.button.classList.remove('animate');
      }
      this.isAnimating = false;
    }, 600);
  }

  /**
   * Perform the actual scroll
   */
  performScroll() {
    // Check if browser supports smooth scrolling
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers
      this.smoothScrollToTop();
    }
  }

  /**
   * Custom smooth scroll for older browsers
   */
  smoothScrollToTop() {
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    
    if (currentScroll > 0) {
      window.requestAnimationFrame(() => this.smoothScrollToTop());
      window.scrollTo(0, currentScroll - (currentScroll / 8));
    }
  }

  /**
   * Setup intersection observer for enhanced UX
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If top of page is visible, hide the button
          this.hide();
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe the first element of the page
    const firstElement = document.querySelector('nav, header, main');
    if (firstElement) {
      observer.observe(firstElement);
    }
  }

  /**
   * Get current scroll progress
   * @returns {number} Scroll progress as percentage (0-100)
   */
  getScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return Math.min((scrollTop / docHeight) * 100, 100);
  }

  /**
   * Check if button is visible
   * @returns {boolean}
   */
  isButtonVisible() {
    return this.isVisible;
  }

  /**
   * Set custom show threshold
   * @param {number} threshold - Scroll distance before showing button
   */
  setShowThreshold(threshold) {
    this.showThreshold = threshold;
    this.update();
  }

  /**
   * Get button state
   * @returns {Object} Button state information
   */
  getState() {
    return {
      isVisible: this.isVisible,
      isAnimating: this.isAnimating,
      scrollProgress: this.getScrollProgress(),
      showThreshold: this.showThreshold
    };
  }

  /**
   * Destroy scroll-to-top (cleanup)
   */
  destroy() {
    // Clear timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Remove event listeners
    window.removeEventListener('scroll', this.throttledUpdate);
    document.removeEventListener('keydown', this.handleGlobalKeyboard);

    if (this.button) {
      this.button.removeEventListener('click', this.scrollToTop);
      this.button.removeEventListener('keydown', this.handleKeyboard);
      this.button.removeEventListener('touchstart', this.handleTouchStart);
      this.button.removeEventListener('touchend', this.handleTouchEnd);
    }

    console.log('🚀 Scroll to Top destroyed');
  }
}

// Create global instance
window.scrollToTop = new ScrollToTop();

// Global function for backward compatibility
window.scrollToTopUtils = {
  scrollToTop: () => window.scrollToTop.scrollToTop(),
  updateScrollToTop: () => window.scrollToTop.update(),
  smoothScrollToTop: () => window.scrollToTop.smoothScrollToTop(),
  fallbackScrollToTop: () => window.scrollToTop.performScroll(),
  getScrollProgress: () => window.scrollToTop.getScrollProgress()
};