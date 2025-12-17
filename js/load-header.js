// Function to load header and initialize it
function loadHeader() {
    fetch('/partials/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Header file not found');
            }
            return response.text();
        })
        .then(html => {
            // Insert header at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // Set active page based on current URL
            setActivePage();
            
            // Initialize mobile menu functionality
            initializeMobileMenu();
            
            // Fix navbar gap
            fixNavbarGap();
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

// Set active link in navigation
function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize mobile menu toggle
function initializeMobileMenu() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navbarToggle || !navMenu) return;
    
    navbarToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        const hamburgerIcon = this.querySelector('.hamburger-icon') || this;
        if (navMenu.classList.contains('active')) {
            hamburgerIcon.textContent = '✕';
            this.setAttribute('aria-expanded', 'true');
        } else {
            hamburgerIcon.textContent = '☰';
            this.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu when clicking links (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const hamburgerIcon = navbarToggle.querySelector('.hamburger-icon') || navbarToggle;
                hamburgerIcon.textContent = '☰';
                navbarToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Fix navbar gap dynamically
// Fix navbar gap dynamically - RAF Optimized
function fixNavbarGap() {
    const navbar = document.querySelector('.fixed-top');
    if (!navbar) return;
    
    let rafId = null;
    let lastHeight = 0;
    
    function updatePadding() {
        // Cancel any pending RAF
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        
        // Schedule update in next frame
        rafId = requestAnimationFrame(() => {
            const navbarHeight = navbar.offsetHeight;
            
            // Only update if height changed
            if (navbarHeight !== lastHeight) {
                document.body.style.paddingTop = navbarHeight + 'px';
                lastHeight = navbarHeight;
            }
            rafId = null;
        });
    }
    
    // Use ResizeObserver if available, fallback to resize
    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(updatePadding);
        observer.observe(navbar);
        
        // Also observe body for font loading
        window.addEventListener('load', () => {
            setTimeout(updatePadding, 100);
        });
        
        return () => observer.disconnect();
    } else {
        // Fallback for older browsers
        updatePadding(); // Initial
        
        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updatePadding, 100);
        });
        
        window.addEventListener('load', () => {
            setTimeout(updatePadding, 300); // Allow fonts to load
        });
    }
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader);