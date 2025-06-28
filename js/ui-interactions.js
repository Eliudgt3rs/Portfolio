/**
 * UI Interactions Module - Minimal Version
 * Basic UI interactions and effects
 */

class UIInteractions {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  init() {
    this.setupButtonInteractions();
    this.setupContactModal();
    this.isInitialized = true;
    console.log('✨ UI Interactions initialized');
  }

  setupButtonInteractions() {
    const buttons = document.querySelectorAll('.btn-enhanced');
    
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px) scale(1.02)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  setupContactModal() {
    const callButton = document.getElementById('callButton');
    
    if (callButton) {
      callButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCall();
      });
    }
  }

  handleCall() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    
    if (isMobile) {
      window.open('tel:+254719790026', '_self');
    } else {
      alert('Contact Options:\n\n📞 Phone: +254719790026\n💬 WhatsApp: Click the WhatsApp button\n✉️ Email: Visit the Contact page');
    }
  }

  getState() {
    return {
      isInitialized: this.isInitialized
    };
  }
}

// Create global instance
window.uiInteractions = new UIInteractions();

// Global function for backward compatibility
window.handleCall = () => {
  window.uiInteractions.handleCall();
};