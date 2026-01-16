// ============================================
// RANGYUL GROUP OF HOTELS - JAVASCRIPT
// Updated with Premium Offers & Enhanced Animations
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing components');
    // Initialize all components in correct order
    initMobileMenu();
    initScrollProgress();
    initHeaderScroll();
    initHeroSlider();
    initScrollAnimations();
    initPropertyCards();
    initContactCards();
    initSocialIcons();
    initStatsCounter();
    updateCurrentYear();
    initQuickBookingModal();
    initPremiumOffers();
    
    // Initialize Leaflet Map
    initLeafletMap();
});

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== SCROLL PROGRESS ====================
function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });
}

// ==================== HEADER SCROLL EFFECT ====================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ==================== HERO SLIDER ====================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval = null;
    const slideDuration = 7000;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
            currentSlide = index;
        }
    }
    
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    function startSlider() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    function stopSlider() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    if (slides.length > 0) {
        showSlide(0);
        startSlider();
    }
    
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlider);
        heroSlider.addEventListener('mouseleave', startSlider);
    }
}

// ==================== QUICK BOOKING MODAL ====================
function initQuickBookingModal() {
    const modal = document.getElementById('bookingModal');
    const quickBookBtns = document.querySelectorAll('.quick-book-trigger, .hero-quick-book-btn');
    const offerBookBtns = document.querySelectorAll('.offer-book-trigger');
    const closeBtn = document.querySelector('.modal-close');
    const form = document.getElementById('quickBookingForm');
    const selectedOfferInput = document.getElementById('selected-offer');
    
    if (!modal || !form) return;
    
    // Open modal from regular buttons
    quickBookBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            selectedOfferInput.value = '';
            openBookingModal();
        });
    });
    
    // Open modal from offer buttons with specific offer
    offerBookBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const offer = this.getAttribute('data-offer');
            selectedOfferInput.value = offer;
            openBookingModal();
        });
    });
    
    // Open modal function
    function openBookingModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set default dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        document.getElementById('booking-checkin').valueAsDate = today;
        document.getElementById('booking-checkout').valueAsDate = tomorrow;
        
        // Auto-focus first input
        setTimeout(() => {
            document.getElementById('booking-name').focus();
        }, 300);
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('booking-name').value.trim(),
            phone: document.getElementById('booking-phone').value.trim(),
            email: document.getElementById('booking-email').value.trim(),
            checkin: document.getElementById('booking-checkin').value,
            checkout: document.getElementById('booking-checkout').value,
            guests: document.getElementById('booking-guests').value,
            property: document.getElementById('booking-property').value,
            message: document.getElementById('booking-message').value.trim(),
            offer: selectedOfferInput.value
        };
        
        // Validate required fields
        if (!formData.name || !formData.phone || !formData.checkin || !formData.checkout || !formData.guests || !formData.property) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Format dates
        const checkinDate = new Date(formData.checkin);
        const checkoutDate = new Date(formData.checkout);
        const formattedCheckin = checkinDate.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        const formattedCheckout = checkoutDate.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        
        // Create WhatsApp message
        let whatsappMessage = `*New Booking Request - Rangyul Hotels*%0A%0A` +
                               `*Name:* ${formData.name}%0A` +
                               `*Phone:* ${formData.phone}%0A` +
                               (formData.email ? `*Email:* ${formData.email}%0A` : '') +
                               `*Check-in:* ${formattedCheckin}%0A` +
                               `*Check-out:* ${formattedCheckout}%0A` +
                               `*Guests:* ${formData.guests}%0A` +
                               `*Property:* ${formData.property}%0A`;
        
        // Add offer information if selected
        if (formData.offer) {
            whatsappMessage += `*Selected Offer:* ${formData.offer}%0A`;
        }
        
        // Add custom message if provided
        if (formData.message) {
            whatsappMessage += `*Message:* ${formData.message}%0A%0A`;
        } else {
            whatsappMessage += '%0A';
        }
        
        whatsappMessage += `_Sent via Rangyul Website Quick Booking_`;
        
        // Redirect to WhatsApp
        const whatsappUrl = `https://wa.me/918899452417?text=${whatsappMessage}`;
        
        // Show success message
        const submitBtn = form.querySelector('.booking-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Redirected Successfully!';
            submitBtn.style.background = 'linear-gradient(135deg, #2d4a2d 0%, #3a6b3a 100%)';
            
            // Reset form and close modal after delay
            setTimeout(() => {
                form.reset();
                selectedOfferInput.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                closeModal();
                showNotification('Redirected to WhatsApp! Please confirm your booking there.', 'success');
            }, 1500);
        }, 1000);
    });
    
    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `booking-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, var(--luxury-green) 0%, #3a6b3a 100%)' : 'linear-gradient(135deg, #8b1e3f 0%, #a83232 100%)'};
            color: white;
            padding: 15px 20px;
            border-radius: var(--radius-medium);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            box-shadow: var(--shadow-large);
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== PREMIUM OFFERS ====================
function initPremiumOffers() {
    const offerCards = document.querySelectorAll('.premium-offer-card');
    
    // Add hover effects
    offerCards.forEach(card => {
        // Add click event for the whole card (except buttons)
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.premium-book-btn') && !e.target.closest('a')) {
                const offerBtn = this.querySelector('.premium-book-btn');
                if (offerBtn && offerBtn.classList.contains('offer-book-trigger')) {
                    offerBtn.click();
                }
            }
        });
        
        // Add keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const offerBtn = this.querySelector('.premium-book-btn');
                if (offerBtn && offerBtn.classList.contains('offer-book-trigger')) {
                    offerBtn.click();
                }
            }
        });
    });
    
    // Initialize intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    offerCards.forEach(card => {
        observer.observe(card);
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.feature-item, .property-card, .contact-card, .premium-offer-card, .stat-item, .map-property-card').forEach(el => el.style.opacity = '1');
        return;
    }
    
    const animatedElements = document.querySelectorAll('.feature-item, .property-card, .premium-offer-card, .stat-item, .map-property-card, .content-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s var(--transition-smooth), transform 0.6s var(--transition-smooth)';
        observer.observe(el);
    });
}

// ==================== PROPERTY CARDS ====================
function initPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            const glow = this.querySelector('.property-glow');
            if (glow) glow.style.opacity = '0.8';
        });
        
        card.addEventListener('mouseleave', function() {
            const glow = this.querySelector('.property-glow');
            if (glow) glow.style.opacity = '0.3';
        });
        
        initPropertySlider(card, index);
    });
}

function initPropertySlider(propertyCard, cardIndex) {
    const slider = propertyCard.querySelector('.property-slider');
    const slides = propertyCard.querySelectorAll('.property-slide');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval = null;
    const slideDuration = 5000;
    
    slides.forEach((slide, index) => {
        if (index === 0) {
            slide.classList.add('active');
            slide.style.opacity = '1';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        }
    });
    
    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.transition = 'opacity 0.8s ease-in-out';
        });
        
        if (slides[index]) {
            slides[index].classList.add('active');
            slides[index].style.opacity = '1';
            currentSlide = index;
        }
    }
    
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    function startSlider() {
        if (slides.length > 1) {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        }
    }
    
    function stopSlider() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    if (slides.length > 1) {
        startSlider();
        
        propertyCard.addEventListener('mouseenter', stopSlider);
        propertyCard.addEventListener('mouseleave', startSlider);
    }
    
    setTimeout(() => {
        if (slides[0]) {
            slides[0].style.opacity = '1';
        }
    }, 100);
}

// ==================== CONTACT CARDS ====================
function initContactCards() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) icon.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) icon.style.transform = 'scale(1)';
        });
    });
}

// ==================== SOCIAL ICONS ====================
function initSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icon-footer');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ==================== STATS COUNTER ====================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    statNumber.textContent = Math.floor(current);
                }, 16);
                
                observer.unobserve(statNumber);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px 50px 0px'
    });
    
    statNumbers.forEach(statNumber => {
        statNumber.textContent = '0';
        observer.observe(statNumber);
    });
}

// ==================== LEAFLET MAP ====================
function initLeafletMap() {
    const mapElement = document.getElementById('leaflet-map');
    if (!mapElement) return;
    
    // Property locations
    const properties = [
        {
            id: 'hotel-rangyul',
            name: 'Hotel Rangyul',
            lat: 34.5576,
            lng: 76.1252,
            description: 'Baroo, Kargil - Town Center Location',
            icon: '🏨',
            color: '#d4af37'
        },
        {
            id: 'rangyul-resort',
            name: 'Rangyul Resort',
            lat: 34.5100,
            lng: 76.1350,
            description: 'Suru Valley, Kargil - Valley View',
            icon: '🏔️',
            color: '#d4af37'
        },
        {
            id: 'galaxy-hotel',
            name: 'Galaxy Hotel',
            lat: 34.5571,
            lng: 76.1324,
            description: 'Kargil Center - Premium Location',
            icon: '⭐',
            color: '#d4af37'
        }
    ];
    
    // Initialize map
    const map = L.map(mapElement).setView([34.5576, 76.1252], 12);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);
    
    // Add custom styling to map
    mapElement.style.background = 'var(--luxury-dark)';
    
    // Create custom markers with golden color
    const markers = [];
    
    // Custom icon for markers
    const goldenIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #d4af37; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });
    
    properties.forEach(property => {
        // Create marker
        const marker = L.marker([property.lat, property.lng], { 
            icon: goldenIcon,
            title: property.name
        }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="map-marker-popup">
                <h3>${property.icon} ${property.name}</h3>
                <p>${property.description}</p>
                <a href="${property.id}.html">
                    View Details <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
        });
        
        // Store marker reference
        markers.push({
            marker: marker,
            property: property
        });
        
        // Add click event to marker
        marker.on('click', function() {
            // Highlight corresponding property card
            const propertyCards = document.querySelectorAll('.map-property-card');
            propertyCards.forEach(card => card.classList.remove('active'));
            const targetCard = document.querySelector(`.map-property-card[data-location="${property.id}"]`);
            if (targetCard) targetCard.classList.add('active');
        });
    });
    
    // Add click events to property cards
    const propertyCards = document.querySelectorAll('.map-property-card');
    propertyCards.forEach(card => {
        card.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            
            // Update active state
            propertyCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Find corresponding marker
            const markerData = markers.find(m => m.property.id === location);
            if (markerData) {
                // Center map on property
                map.setView([lat, lng], 14);
                
                // Open popup after a short delay
                setTimeout(() => {
                    markerData.marker.openPopup();
                }, 500);
            }
        });
    });
    
    // Add Kargil area highlight
    const kargilArea = L.polygon([
        [34.55, 76.12],
        [34.56, 76.12],
        [34.56, 76.13],
        [34.55, 76.13]
    ], {
        color: '#d4af37',
        fillColor: '#d4af37',
        fillOpacity: 0.1,
        weight: 1,
        opacity: 0.3
    }).addTo(map);
    
    // Add custom controls for better UX
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
    
    // Add a custom attribution
    const customAttribution = L.control.attribution({prefix: false});
    customAttribution.addAttribution('Rangyul Group of Hotels');
    customAttribution.addTo(map);
    
    // Handle map resize on window resize
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
    
    window.addEventListener('resize', function() {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    });
}

// ==================== UPDATE CURRENT YEAR ====================
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== WINDOW LOAD EVENT ====================
window.addEventListener('load', function() {
    console.log('Page fully loaded - ensuring all features work');
    
    // Re-initialize property sliders
    setTimeout(() => {
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach((card, index) => {
            initPropertySlider(card, index);
        });
    }, 500);
    
    // Add loaded class for fade-in effects
    document.body.classList.add('loaded');
    
    // Initialize stats counter
    initStatsCounter();
    
    // Trigger map resize after images load
    if (typeof L !== 'undefined') {
        setTimeout(() => {
            const map = L && L.map && document.querySelector('.leaflet-container') ? 
                L.map(document.querySelector('.leaflet-container')) : null;
            if (map) {
                map.invalidateSize();
            }
        }, 300);
    }
});