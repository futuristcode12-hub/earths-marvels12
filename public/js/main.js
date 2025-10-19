// Main JavaScript for Earth's Marvels website

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePageSpecificFeatures();
    initializeForms();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .logo, .btn[data-page]');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    console.log('✅ Mobile menu elements FOUND:', {
        mobileMenuBtn: mobileMenuBtn,
        navLinksContainer: navLinksContainer,
        navLinksContainerStyle: window.getComputedStyle(navLinksContainer).display
    });
    
    // Mobile menu toggle - SUPER DEBUG VERSION
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟡 Mobile menu CLICKED');
            console.log('📱 Before toggle - classList:', navLinksContainer.classList.toString());
            console.log('📱 Before toggle - computed display:', window.getComputedStyle(navLinksContainer).display);
            
            // Toggle the active class
            navLinksContainer.classList.toggle('active');
            
            console.log('📱 After toggle - classList:', navLinksContainer.classList.toString());
            console.log('📱 After toggle - computed display:', window.getComputedStyle(navLinksContainer).display);
            console.log('📱 Has active class?', navLinksContainer.classList.contains('active'));
        });
        
        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinksContainer.classList.remove('active');
                console.log('Nav link clicked - menu closed');
            });
        });
    } else {
        console.error('❌ Mobile menu elements NOT FOUND:');
        console.error('Mobile button:', mobileMenuBtn);
        console.error('Nav container:', navLinksContainer);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinksContainer && navLinksContainer.classList.contains('active')) {
            if (!event.target.closest('nav')) {
                navLinksContainer.classList.remove('active');
                console.log('Clicked outside - menu closed');
            }
        }
    });
    
    // Handle navigation for single-page app style
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                e.preventDefault();
                showPage(pageId);
                
                // Update URL without reloading
                window.history.pushState({ page: pageId }, '', `/${pageId === 'home' ? '' : pageId}`);
                
                // Close mobile menu if open
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                }
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const page = event.state ? event.state.page : 'home';
        showPage(page);
    });
}

// Show specific page (for single-page app functionality)
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Initialize page-specific features
    initializePageSpecificFeatures();
}

// Initialize features specific to each page
function initializePageSpecificFeatures() {
    // Wonders page filtering
    initializeWondersFiltering();
    
    // Gallery page filtering
    initializeGalleryFiltering();
    
    // Image lazy loading
    initializeLazyLoading();
}

// Wonders page category filtering
function initializeWondersFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const wonderItems = document.querySelectorAll('.wonder-item');
    
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Filter items
                wonderItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Gallery page filtering
function initializeGalleryFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const photoItems = document.querySelectorAll('.photo-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter items
                photoItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Image lazy loading
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
}

// Form handling
function initializeForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

// Contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Basic validation
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('loading');
    
    try {
        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            form.reset();
        } else {
            showMessage('There was an error sending your message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('There was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = 'Send Message';
        submitBtn.classList.remove('loading');
    }
}

// Newsletter form submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!emailInput.value) {
        showMessage('Please enter your email address.', 'error', form);
        return;
    }
    
    if (!isValidEmail(emailInput.value)) {
        showMessage('Please enter a valid email address.', 'error', form);
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        showMessage('Thank you for subscribing to our newsletter!', 'success', form);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
    }, 1500);
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            if (!isValidEmail(input.value)) {
                isValid = false;
                input.style.borderColor = '#dc3545';
                showMessage('Please enter a valid email address.', 'error', form);
            }
        }
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message to user
function showMessage(message, type, container = document.body) {
    // Remove existing messages
    const existingMessages = container.querySelector('.success-message, .error-message');
    if (existingMessages) {
        existingMessages.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert message
    if (container === document.body) {
        document.body.insertBefore(messageDiv, document.body.firstChild);
    } else {
        container.insertBefore(messageDiv, container.firstChild);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add some interactive effects
function addInteractiveEffects() {
    // Add parallax effect to hero sections
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}