// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initMobileMenu();
    initNavbarScroll();
    initSmoothScrolling();
    init3DEffect();
    initScrollAnimations();
});

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
        '.scroll-fade-in, .scroll-fade-in-left, .scroll-fade-in-right, .scroll-scale-in'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize loading screen
 */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) return;
    
    // Simulate loading time (you can adjust this)
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000); // Show loading for at least 500ms
    });
    
    // Fallback: hide loading screen after max 3 seconds
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }, 3000);
}

/**
 * Initialize 3D tilt effect on hero section
 */
function init3DEffect() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    // Get the pseudo-element for grid rotation
    const heroBefore = window.getComputedStyle(hero, '::before');
    
    hero.addEventListener('mousemove', function(e) {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation angles (max 10 degrees for visible effect)
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Calculate mouse position in percentage for glow effect
        const mouseXPercent = (x / rect.width) * 100;
        const mouseYPercent = (y / rect.height) * 100;
        
        // Apply rotation to the grid background using CSS custom properties
        hero.style.setProperty('--rotate-x', `${rotateX}deg`);
        hero.style.setProperty('--rotate-y', `${rotateY}deg`);
        hero.style.setProperty('--mouse-x', `${mouseXPercent}%`);
        hero.style.setProperty('--mouse-y', `${mouseYPercent}%`);
        
        // Apply the transform to the ::before pseudo-element via inline style hack
        // We'll use a custom property that the CSS can read
        requestAnimationFrame(() => {
            const transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            hero.style.setProperty('--grid-transform', transform);
        });
    });
    
    hero.addEventListener('mouseenter', function() {
        // Show glow effect
        const style = document.createElement('style');
        style.id = 'hero-glow-style';
        style.textContent = `.hero::after { opacity: 1 !important; }`;
        document.head.appendChild(style);
    });
    
    hero.addEventListener('mouseleave', function() {
        // Reset transformations
        hero.style.setProperty('--rotate-x', '0deg');
        hero.style.setProperty('--rotate-y', '0deg');
        
        // Remove glow
        const glowStyle = document.getElementById('hero-glow-style');
        if (glowStyle) {
            glowStyle.remove();
        }
    });
    
    // Apply custom property to CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .hero::before {
            transform: var(--grid-transform, perspective(1000px) rotateX(0deg) rotateY(0deg)) !important;
        }
    `;
    document.head.appendChild(styleSheet);
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        // Toggle mobile menu
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
            }
        });
    }
}

/**
 * Initialize navbar scroll effects
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

/**
 * Initialize smooth scrolling for internal links
 */
function initSmoothScrolling() {
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
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}