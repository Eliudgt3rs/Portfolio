/**
 * Theme Manager Module
 * Handles theme switching, persistence, and synchronization across tabs
 */

class ThemeManager {
  constructor() {
    this.defaultTheme = 'dark';
    this.themeKey = 'theme';
    this.timestampKey = 'theme-timestamp';
    
    this.init();
  }

  /**
   * Initialize theme manager
   */
  init() {
    this.loadSavedTheme();
    this.bindEvents();
    this.setupKeyboardShortcuts();
    
    console.log('🎨 Theme Manager initialized');
  }

  /**
   * Load theme from localStorage or use default
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.themeKey) || this.defaultTheme;
    this.setTheme(savedTheme, false);
  }

  /**
   * Set theme with optional animation
   * @param {string} theme - Theme name ('light' or 'dark')
   * @param {boolean} animate - Whether to animate the transition
   */
  setTheme(theme, animate = true) {
    const body = document.body;
    
    if (animate) {
      body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        body.style.transition = '';
      }, 300);
    }
    
    body.setAttribute('data-theme', theme);
    localStorage.setItem(this.themeKey, theme);
    
    // Broadcast theme change
    this.broadcastThemeChange(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    this.setTheme(newTheme);
    
    // Update timestamp for cross-tab sync
    localStorage.setItem(this.timestampKey, Date.now().toString());
  }

  /**
   * Broadcast theme change to other parts of the application
   * @param {string} theme - New theme
   */
  broadcastThemeChange(theme) {
    const event = new CustomEvent('themeChanged', { 
      detail: { theme, timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
  }

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return document.body.getAttribute('data-theme') || this.defaultTheme;
  }

  /**
   * Check if current theme is dark
   * @returns {boolean} True if dark theme
   */
  isDarkTheme() {
    return this.getCurrentTheme() === 'dark';
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.themeKey) {
        this.setTheme(e.newValue || this.defaultTheme, false);
      }
    });

    // Listen for custom theme change events
    window.addEventListener('themeChanged', (e) => {
      // Additional logic for theme change can be added here
      console.log('Theme changed to:', e.detail.theme);
    });

    // Theme toggle button click handler
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
      
      // Keyboard accessibility
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+L for theme toggle
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  /**
   * Get theme-appropriate color values
   * @param {string} property - CSS custom property name
   * @returns {string} Color value
   */
  getThemeColor(property) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(property)
      .trim();
  }

  /**
   * Apply theme to dynamic elements
   * @param {HTMLElement} element - Element to apply theme
   */
  applyThemeToElement(element) {
    if (!element) return;
    
    const theme = this.getCurrentTheme();
    element.setAttribute('data-theme', theme);
  }

  /**
   * Prefers color scheme detection
   * @returns {string} System preferred theme
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Auto-detect and set system theme
   */
  useSystemTheme() {
    const systemTheme = this.getSystemTheme();
    this.setTheme(systemTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        this.setTheme(newSystemTheme);
      });
    }
  }
}

// Create global instance
window.themeManager = new ThemeManager();

// Global function for backward compatibility
window.toggleTheme = () => {
  window.themeManager.toggleTheme();
};