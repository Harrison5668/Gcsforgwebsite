// Language Toggle Functionality
let currentLang = 'en';

document.addEventListener('DOMContentLoaded', function() {
    // Language Toggle Button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
                
                // Smooth scroll to target
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });

    // Intersection Observer for Fade-in Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.objective-card, .vm-card, .value-item').forEach(el => {
        observer.observe(el);
    });
});

// Toggle Language Function
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    
    // Update html lang attribute for background image switching
    document.documentElement.setAttribute('lang', currentLang);
    
    // Toggle all language-specific elements
    document.querySelectorAll('.lang-en, .lang-zh').forEach(el => {
        if (el.classList.contains(`lang-${currentLang}`)) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });

    // Update navigation items with data attributes
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        if (el.tagName === 'A' || el.tagName === 'BUTTON') {
            el.textContent = currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
        }
    });

    // Update page title
    if (currentLang === 'zh') {
        document.title = '全球女性领导力峰会暨影响力颁奖典礼 | CSW70';
    } else {
        document.title = 'CSW70 Global Women Leadership Summit & Impact Award Ceremony';
    }

    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', currentLang);
}

// Load saved language preference on page load
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== currentLang) {
        toggleLanguage();
    } else {
        // Set initial lang attribute
        document.documentElement.setAttribute('lang', currentLang);
    }
});

// Handle window resize for mobile menu
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('active');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    }, 250);
});

// Toggle speaker bio function
function toggleBio(button, event) {
    // Prevent any default button behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const card = button.closest('.speaker-card');
    const bio = card.querySelector('.speaker-bio');
    const isExpanded = bio.classList.contains('expanded');
    
    // Get or create overlay
    let overlay = document.getElementById('bioOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'bioOverlay';
        overlay.className = 'speaker-bio-overlay';
        document.body.appendChild(overlay);
        
        // Click overlay to close
        overlay.addEventListener('click', function() {
            closeBio();
        });
    }
    
    // Toggle current bio
    if (isExpanded) {
        closeBio();
    } else {
        // Close all other bios first
        closeBio();
        
        // Open current bio immediately without any delay
        bio.classList.add('expanded');
        overlay.classList.add('active');
        button.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        if (currentLang === 'zh') {
            button.querySelector('.lang-zh').textContent = '收起简介';
        } else {
            button.querySelector('.lang-en').textContent = 'Close Bio';
        }
    }
}

// Close bio function
function closeBio() {
    const overlay = document.getElementById('bioOverlay');
    
    document.querySelectorAll('.speaker-bio.expanded').forEach(bio => {
        bio.classList.remove('expanded');
        const button = bio.closest('.speaker-card').querySelector('.btn-view-bio');
        button.classList.remove('active');
        
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        if (currentLang === 'zh') {
            button.querySelector('.lang-zh').textContent = '查看简介';
        } else {
            button.querySelector('.lang-en').textContent = 'View Bio';
        }
    });
    
    if (overlay) {
        overlay.classList.remove('active');
    }
    document.body.style.overflow = ''; // Restore scrolling
}

// Add ESC key to close bio
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBio();
    }
});

// Venue Image Carousel
let currentVenueSlide = 0;
const venueSlides = document.querySelectorAll('.venue-slide');
const venueIndicators = document.querySelectorAll('.carousel-indicators .indicator');

function showVenueSlide(n) {
    // Wrap around if out of bounds
    if (n >= venueSlides.length) {
        currentVenueSlide = 0;
    } else if (n < 0) {
        currentVenueSlide = venueSlides.length - 1;
    } else {
        currentVenueSlide = n;
    }
    
    // Hide all slides
    venueSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active from all indicators
    venueIndicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide
    venueSlides[currentVenueSlide].classList.add('active');
    venueIndicators[currentVenueSlide].classList.add('active');
}

function changeVenueSlide(direction) {
    showVenueSlide(currentVenueSlide + direction);
}

function goToVenueSlide(n) {
    showVenueSlide(n);
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Auto-play carousel (optional)
    // setInterval(() => {
    //     changeVenueSlide(1);
    // }, 5000);
    
    // Keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeVenueSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeVenueSlide(1);
        }
    });
});
