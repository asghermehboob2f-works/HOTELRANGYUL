document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
});

function initializeComponents() {
    initBookingSystem();
    initGalleryModal();
    initBackToTop();
    updateCurrentYear();
    setMinDates();
    initStatsCounter();
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const targetValue = parseFloat(stat.getAttribute('data-value'));
        const isDecimal = targetValue % 1 !== 0;
        const duration = 2000;
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = targetValue / steps;
        let currentValue = 0;
        let stepCount = 0;
        
        const timer = setInterval(() => {
            stepCount++;
            currentValue += increment;
            
            if (stepCount >= steps) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            if (isDecimal) {
                stat.textContent = currentValue.toFixed(1);
            } else {
                stat.textContent = Math.floor(currentValue);
            }
        }, stepTime);
    });
}

function initGalleryModal() {
    const galleryModal = document.getElementById('galleryModal');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModalImg = galleryModal.querySelector('.gallery-modal-img');
    const galleryModalCaption = galleryModal.querySelector('.gallery-modal-caption');
    const galleryModalClose = galleryModal.querySelector('.gallery-modal-close');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const caption = this.querySelector('.gallery-text').textContent;
            
            galleryModalImg.src = imgSrc;
            galleryModalImg.alt = caption;
            galleryModalCaption.textContent = caption;
            
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                galleryModal.style.opacity = '1';
                galleryModal.classList.add('active');
            }, 10);
        });
    });
    
    function closeGalleryModal() {
        galleryModal.style.opacity = '0';
        galleryModal.classList.remove('active');
        
        setTimeout(() => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    galleryModalClose.addEventListener('click', closeGalleryModal);
    
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            closeGalleryModal();
        }
    });
}

function initBookingSystem() {
    const bookingModal = document.getElementById('bookingModal');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBookingBtn = document.getElementById('cancelBooking');
    const bookingForm = document.getElementById('bookingForm');
    
    const selectedRoomName = document.getElementById('selectedRoomName');
    const summaryRoom = document.getElementById('summaryRoom');
    const summaryPrice = document.getElementById('summaryPrice');
    
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const roomName = this.getAttribute('data-room');
            const roomPrice = this.getAttribute('data-price');
            
            selectedRoomName.textContent = roomName;
            summaryRoom.textContent = roomName;
            summaryPrice.textContent = roomPrice;
            
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                bookingModal.style.opacity = '1';
                bookingModal.classList.add('active');
            }, 10);
            
            clearErrors();
            if (bookingForm) bookingForm.reset();
            setMinDates();
        });
    });
    
    function closeModal() {
        bookingModal.style.opacity = '0';
        bookingModal.classList.remove('active');
        setTimeout(() => {
            bookingModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
        clearErrors();
    }
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelBookingBtn) cancelBookingBtn.addEventListener('click', closeModal);
    
    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) closeModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingModal.style.display === 'flex') closeModal();
    });
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateBookingForm()) {
                const name = document.getElementById('guestName').value.trim();
                const phone = document.getElementById('guestPhone').value.trim();
                const checkIn = document.getElementById('checkInDate').value;
                const checkOut = document.getElementById('checkOutDate').value;
                const guests = document.getElementById('guestCount').value;
                const room = summaryRoom.textContent;
                const price = summaryPrice.textContent;
                
                const nights = calculateNights(checkIn, checkOut);
                sendToWhatsApp(name, phone, checkIn, checkOut, nights, guests, room, price);
                closeModal();
            }
        });
    }
    
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    
    if (checkInDate && checkOutDate) {
        checkInDate.addEventListener('change', function() {
            const checkInValue = new Date(this.value);
            const minCheckOut = new Date(checkInValue);
            minCheckOut.setDate(minCheckOut.getDate() + 1);
            
            checkOutDate.min = minCheckOut.toISOString().split('T')[0];
            
            const checkOutValue = new Date(checkOutDate.value);
            if (checkOutValue <= checkInValue) checkOutDate.value = '';
        });
        
        checkOutDate.addEventListener('change', function() {
            const checkInValue = new Date(checkInDate.value);
            const checkOutValue = new Date(this.value);
            
            if (checkOutValue <= checkInValue) {
                showError(this, 'Check-out date must be after check-in date');
            } else {
                clearError(this);
            }
        });
    }
}

function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 1;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return nights > 0 ? nights : 1;
}

function setMinDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    
    if (checkInDate) checkInDate.min = today.toISOString().split('T')[0];
    if (checkOutDate) checkOutDate.min = tomorrow.toISOString().split('T')[0];
}

function validateBookingForm() {
    let isValid = true;
    
    const nameInput = document.getElementById('guestName');
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
    } else clearError(nameInput);
    
    const phoneInput = document.getElementById('guestPhone');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneInput.value.trim()) {
        showError(phoneInput, 'Please enter your phone number');
        isValid = false;
    } else if (!phoneRegex.test(phoneInput.value.trim())) {
        showError(phoneInput, 'Please enter a valid 10-digit phone number');
        isValid = false;
    } else clearError(phoneInput);
    
    const checkInDate = document.getElementById('checkInDate');
    if (!checkInDate.value) {
        showError(checkInDate, 'Please select check-in date');
        isValid = false;
    } else clearError(checkInDate);
    
    const checkOutDate = document.getElementById('checkOutDate');
    if (!checkOutDate.value) {
        showError(checkOutDate, 'Please select check-out date');
        isValid = false;
    } else {
        const checkInValue = new Date(checkInDate.value);
        const checkOutValue = new Date(checkOutDate.value);
        
        if (checkOutValue <= checkInValue) {
            showError(checkOutDate, 'Check-out date must be after check-in date');
            isValid = false;
        } else clearError(checkOutDate);
    }
    
    const guestsInput = document.getElementById('guestCount');
    if (!guestsInput.value) {
        showError(guestsInput, 'Please select number of guests');
        isValid = false;
    } else clearError(guestsInput);
    
    return isValid;
}

function showError(input, message) {
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.3rem';
    errorDiv.style.display = 'flex';
    errorDiv.style.alignItems = 'center';
    errorDiv.style.gap = '0.3rem';
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ff6b6b';
}

function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
    input.style.borderColor = 'rgba(212, 175, 55, 0.15)';
}

function clearErrors() {
    const inputs = document.querySelectorAll('#bookingForm input, #bookingForm select');
    inputs.forEach(input => clearError(input));
}

function sendToWhatsApp(name, phone, checkIn, checkOut, nights, guests, room, price) {
    const formattedCheckIn = formatDate(checkIn);
    const formattedCheckOut = formatDate(checkOut);
    
    let message = `*🏨 Galaxy Hotel - Booking Request*%0A%0A`;
    message += `*Guest Name:* ${name}%0A`;
    message += `*Phone:* ${phone}%0A`;
    message += `*Check-in Date:* ${formattedCheckIn}%0A`;
    message += `*Check-out Date:* ${formattedCheckOut}%0A`;
    message += `*Number of Nights:* ${nights}%0A`;
    message += `*Number of Guests:* ${guests}%0A`;
    message += `*Room Type:* ${room}%0A`;
    message += `*Price:* ${price}%0A%0A`;
    message += `_This booking request was sent from Galaxy Hotel website_`;
    
    const whatsappNumber = '918899452417';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    showSuccessNotification();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'booking-success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Booking Request Sent!</h4>
                <p>You'll be redirected to WhatsApp to complete your booking for Galaxy Hotel.</p>
            </div>
        </div>
    `;
    
    notification.style.position = 'fixed';
    notification.style.top = '30px';
    notification.style.right = '30px';
    notification.style.background = 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.95))';
    notification.style.border = '1px solid rgba(212, 175, 55, 0.3)';
    notification.style.borderRadius = '10px';
    notification.style.padding = '1rem';
    notification.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5)';
    notification.style.zIndex = '10001';
    notification.style.backdropFilter = 'blur(10px)';
    notification.style.maxWidth = '300px';
    notification.style.animation = 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
    `;
    document.head.appendChild(style);
    
    const content = notification.querySelector('.notification-content');
    content.style.display = 'flex';
    content.style.alignItems = 'flex-start';
    content.style.gap = '0.8rem';
    
    const icon = notification.querySelector('i');
    icon.style.color = 'var(--luxury-gold)';
    icon.style.fontSize = '1.5rem';
    
    const heading = notification.querySelector('h4');
    heading.style.color = 'var(--luxury-ivory)';
    heading.style.fontFamily = 'var(--font-cinzel)';
    heading.style.margin = '0 0 0.3rem 0';
    heading.style.fontSize = '1rem';
    
    const para = notification.querySelector('p');
    para.style.color = 'rgba(245, 241, 232, 0.7)';
    para.style.margin = '0';
    para.style.fontSize = '0.85rem';
    para.style.lineHeight = '1.4';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 400);
    }, 5000);
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
                setTimeout(() => {
                    backToTopBtn.style.opacity = '1';
                    backToTopBtn.classList.add('visible');
                }, 10);
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.classList.remove('visible');
                setTimeout(() => {
                    if (window.pageYOffset <= 300) backToTopBtn.style.display = 'none';
                }, 300);
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
}

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });
});