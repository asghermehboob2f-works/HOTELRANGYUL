// ============================================
// RANGYUL GROUP OF HOTELS - CONTACT PAGE JS
// Enhanced with better UX, validation, and animations
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📞 Rangyul Contact Page - Enhanced Version Loaded');
    
    // Initialize all components
    initContactForm();
    initContactModal();
    initContactCards();
    initMapInteractions();
    initFormValidation();
    initCharacterCounter();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Generate reference ID for modal
    generateReferenceId();
});

// ============================================
// ENHANCED CONTACT FORM HANDLING
// ============================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    
    if (!contactForm) return;
    
    // Store original button content
    const originalBtnContent = submitBtn.innerHTML;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📧 Form submission initiated');
        
        // Validate form before submission
        if (!validateForm()) {
            showFormStatus('Please fix the errors above.', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        // Simulate API call delay
        await simulateFormSubmission();
        
        // Handle success
        handleFormSuccess();
    });
    
    // Real-time input validation
    contactForm.addEventListener('input', function(e) {
        const input = e.target;
        if (input.hasAttribute('required')) {
            validateField(input);
        }
    });
}

// Advanced form validation
function validateForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate each required field
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional validation for email format
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}Error`);
    
    // Clear previous error
    if (errorElement) errorElement.textContent = '';
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        const fieldName = field.previousElementSibling?.textContent || 'This field';
        showFieldError(field, `${fieldName} is required`);
        return false;
    }
    
    // Field-specific validations
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    // Mark field as valid
    field.classList.remove('error');
    field.classList.add('valid');
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');
    
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
    
    document.querySelectorAll('.form-control').forEach(field => {
        field.classList.remove('error', 'valid');
    });
}

// Email validation with better regex
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Phone validation for Indian numbers
function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleaned = phone.replace(/\D/g, '');
    return phoneRegex.test(cleaned);
}

// Form submission simulation
async function simulateFormSubmission() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('✅ Form submitted successfully');
            resolve();
        }, 1500);
    });
}

// Loading state management
function setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        btnText.textContent = 'Sending...';
        showFormStatus('Processing your request...', 'info');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        btnText.textContent = 'Send Message';
    }
}

// Form success handler
function handleFormSuccess() {
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Reset character counter
    updateCharCount();
    
    // Show success message
    showFormStatus('Message sent successfully! We\'ll respond within 24 hours.', 'success');
    
    // Reset loading state
    setLoadingState(false);
    
    // Show success modal after delay
    setTimeout(() => {
        showSuccessModal();
    }, 800);
}

// Form status messages
function showFormStatus(message, type = 'info') {
    const formStatus = document.createElement('div');
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    
    // Remove existing status
    const existingStatus = document.querySelector('.form-status');
    if (existingStatus) existingStatus.remove();
    
    // Insert after submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.parentNode.insertBefore(formStatus, submitBtn.nextSibling);
    
    // Auto-remove after 5 seconds for info/success messages
    if (type !== 'error') {
        setTimeout(() => {
            formStatus.style.opacity = '0';
            formStatus.style.transform = 'translateY(-10px)';
            setTimeout(() => formStatus.remove(), 300);
        }, 5000);
    }
}

// Generate reference ID
function generateReferenceId() {
    const refId = `RHG-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const refElement = document.getElementById('referenceId');
    if (refElement) refElement.textContent = refId;
}

// ============================================
// CHARACTER COUNTER FOR MESSAGE FIELD
// ============================================

function initCharacterCounter() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (!messageField || !charCount) return;
    
    messageField.addEventListener('input', updateCharCount);
    
    // Initialize count
    updateCharCount();
}

function updateCharCount() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (!messageField || !charCount) return;
    
    const count = messageField.value.length;
    charCount.textContent = count;
    
    // Change color based on count
    if (count > 450) {
        charCount.style.color = '#ff6b6b';
    } else if (count > 400) {
        charCount.style.color = '#ffa726';
    } else {
        charCount.style.color = 'inherit';
    }
}

// ============================================
// ENHANCED CONTACT MODAL
// ============================================

function initContactModal() {
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    if (!successModal || !closeModalBtn) return;
    
    // Close modal button
    closeModalBtn.addEventListener('click', closeSuccessModal);
    
    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            closeSuccessModal();
        }
    });
}

function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (!successModal) return;
    
    // Generate new reference ID
    generateReferenceId();
    
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track modal view (analytics placeholder)
    console.log('✅ Success modal displayed');
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (!successModal) return;
    
    successModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Smooth scroll to top of form
    setTimeout(() => {
        document.getElementById('contact-form-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

// ============================================
// CONTACT CARDS INTERACTIONS
// ============================================

function initContactCards() {
    const contactCards = document.querySelectorAll('.contact-info-card');
    const contactDetailItems = document.querySelectorAll('.contact-detail-item[href]');
    const socialIcons = document.querySelectorAll('.social-contact-icon');
    
    // Enhanced card hover effects
    contactCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.zIndex = '10';
            
            const icon = this.querySelector('.contact-card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
            
            const icon = this.querySelector('.contact-card-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
    
    // Contact detail items interaction
    contactDetailItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Track link clicks (analytics placeholder)
            console.log(`🔗 Contact link clicked: ${this.href}`);
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Social icons interaction
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation to styles
function addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// MAP INTERACTIONS
// ============================================

function initMapInteractions() {
    const directionsBtn = document.getElementById('directionsBtn');
    const propertyPins = document.querySelectorAll('.property-pin');
    
    // Directions button interaction
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function(e) {
            // Analytics tracking placeholder
            console.log('🗺️ Directions requested to Rangyul Hotels');
            
            // Button animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Property pins interaction
    propertyPins.forEach(pin => {
        pin.addEventListener('click', function() {
            const property = this.getAttribute('data-property');
            showPropertyInfo(property);
        });
        
        // Add tooltip on hover
        pin.addEventListener('mouseenter', function() {
            const label = this.querySelector('.pin-label');
            if (label) {
                label.style.opacity = '1';
                label.style.visibility = 'visible';
                label.style.marginTop = '15px';
            }
        });
        
        pin.addEventListener('mouseleave', function() {
            const label = this.querySelector('.pin-label');
            if (label) {
                label.style.opacity = '0';
                label.style.visibility = 'hidden';
                label.style.marginTop = '10px';
            }
        });
    });
}

function showPropertyInfo(propertyName) {
    const messages = {
        'Hotel Rangyul': 'Hotel Rangyul: Premium accommodation on Srinagar-Ladakh Road with panoramic mountain views.',
        'Rangyul Resort': 'Rangyul Resort: Luxury retreat in Panikhar with spa facilities and adventure activities.',
        'Galaxy Hotel': 'Galaxy Hotel: Business-class hotel in Kargil main market with conference facilities.'
    };
    
    const message = messages[propertyName] || `Information about ${propertyName}`;
    
    // Show temporary notification
    showNotification(message, 'info');
    
    // Log for analytics
    console.log(`📍 Property pin clicked: ${propertyName}`);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(30, 30, 30, 0.95);
        color: var(--luxury-ivory);
        padding: 15px 20px;
        border-radius: 12px;
        border: 1px solid rgba(212, 175, 55, 0.3);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.4s var(--transition-gentle);
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}


// ============================================
// FORM VALIDATION INITIALIZATION
// ============================================

function initFormValidation() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    
    formFields.forEach(field => {
        // Real-time validation on blur
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') || this.value.trim()) {
                validateField(this);
            }
        });
        
        // Clear error on focus
        field.addEventListener('focus', function() {
            this.classList.remove('error');
            const errorElement = document.getElementById(`${this.id}Error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        });
    });
}

// ============================================
// INITIALIZATION HELPER
// ============================================

function initializeAll() {
    addRippleAnimation();
    
    // Add scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.contact-info-card, .tip-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', initializeAll);