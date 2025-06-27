/**
 * Navigation Module
 * Handles navigation bar functionality, mobile menu, and scroll effects
 */

class Navigation {
  constructor() {
    this.mobileMenu = null;
    this.mobileOverlay = null;
    this.toggleButton = null;
    this.navbar = null;
    this.isMenuOpen = false;
    this.scrollThreshold = 50;
    
    this.init();
  }

  /**
   * Initialize navigation
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.setActivePage();
    this.setupScrollEffect();
    this.setupHoverEffects();
    
    console.log('🧭 Navigation initialized');
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.mobileMenu = document.getElementById('mobileNavMenu');
    this.mobileOverlay = document.getElementById('mobileMenuOverlay');
    this.toggleButton = document.getElementById('mobileMenuToggle');
    this.navbar = document.querySelector('.navbar-enhanced');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Mobile menu toggle
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Mobile overlay click
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
    }

    // Mobile menu links
    const mobileNavLinks = document.querySelectorAll('.navbar-nav-mobile .nav-link-enhanced');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Scroll event
    window.addEventListener('scroll', () => this.handleScroll());

    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Close menu when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    if (!this.mobileMenu || !this.mobileOverlay || !this.toggleButton) return;

    this.mobileMenu.classList.add('show');
    this.mobileOverlay.classList.add('show');
    this.toggleButton.classList.add('active');
    this.isMenuOpen = true;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus management
    const firstLink = this.mobileMenu.querySelector('.nav-link-enhanced');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    if (!this.mobileMenu || !this.mobileOverlay || !this.toggleButton) return;

    this.mobileMenu.classList.remove('show');
    this.mobileOverlay.classList.remove('show');
    this.toggleButton.classList.remove('active');
    this.isMenuOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event 
   */
  handleKeyboard(event) {
    // Escape key to close mobile menu
    if (event.key === 'Escape' && this.isMenuOpen) {
      this.closeMobileMenu();
    }

    // Tab navigation within mobile menu
    if (event.key === 'Tab' && this.isMenuOpen) {
      this.handleTabNavigation(event);
    }
  }

  /**
   * Handle tab navigation within mobile menu
   * @param {KeyboardEvent} event 
   */
  handleTabNavigation(event) {
    const focusableElements = this.mobileMenu.querySelectorAll('.nav-link-enhanced');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Handle clicks outside the navigation
   * @param {Event} event 
   */
  handleOutsideClick(event) {
    if (!this.isMenuOpen || !this.navbar) return;

    if (!this.navbar.contains(event.target)) {
      this.closeMobileMenu();
    }
  }

  /**
   * Set active page indicator
   */
  setActivePage() {
    const currentPage = this.getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link-enhanced');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      const parentItem = link.closest('.nav-item-enhanced');

      // Remove active classes
      link.classList.remove('active');
      if (parentItem) parentItem.classList.remove('current-page');

      // Add active class to current page
      if (this.isCurrentPage(linkPage, currentPage)) {
        link.classList.add('active');
        if (parentItem) parentItem.classList.add('current-page');
      }
    });
  }

  /**
   * Get current page from URL
   * @returns {string} Current page filename
   */
  getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
  }

  /**
   * Check if link corresponds to current page
   * @param {string} linkPage - Link href
   * @param {string} currentPage - Current page
   * @returns {boolean}
   */
  isCurrentPage(linkPage, currentPage) {
    return linkPage === currentPage || 
           (currentPage === '' && linkPage === 'index.html') ||
           (currentPage === 'index.html' && linkPage === 'index.html');
  }

  /**
   * Setup navbar scroll effect
   */
  setupScrollEffect() {
    this.handleScroll(); // Initial call
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    if (!this.navbar) return;

    const scrolled = window.scrollY > this.scrollThreshold;

    if (scrolled) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  /**
   * Setup hover effects for navigation links
   */
  setupHoverEffects() {
    const navLinks = document.querySelectorAll('.nav-link-enhanced');
    
    navLinks.forEach(link => {
      let hoverTimeout;

      link.addEventListener('mouseenter', function() {
        clearTimeout(hoverTimeout);
        if (!this.classList.contains('active')) {
          this.style.transform = 'translateY(-2px)';
        }
      });

      link.addEventListener('mouseleave', function() {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          if (!this.classList.contains('active')) {
            this.style.transform = 'translateY(0)';
          }
        }, 50);
      });
    });
  }

  /**
   * Add smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Update navigation on route change
   */
  updateOnRouteChange() {
    this.setActivePage();
    this.closeMobileMenu();
  }

  /**
   * Get navigation state
   * @returns {Object} Navigation state
   */
  getState() {
    return {
      isMenuOpen: this.isMenuOpen,
      currentPage: this.getCurrentPage(),
      isScrolled: this.navbar?.classList.contains('scrolled') || false
    };
  }

  /**
   * Destroy navigation (cleanup)
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleKeyboard);
    document.removeEventListener('click', this.handleOutsideClick);
    
    // Reset body overflow
    document.body.style.overflow = '';
    
    console.log('🧭 Navigation destroyed');
  }
}

// Create global instance
window.navigation = new Navigation();

// Global functions for backward compatibility
window.toggleMobileMenu = () => {
  window.navigation.toggleMobileMenu();
};

window.closeMobileMenu = () => {
  window.navigation.closeMobileMenu();
};

window.openMobileMenu = () => {
  window.navigation.openMobileMenu();
};