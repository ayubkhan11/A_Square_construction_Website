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
function fixNavbarGap() {
    const navbar = document.querySelector('.fixed-top');
    if (!navbar) return;
    
    function updatePadding() {
        const navbarHeight = navbar.offsetHeight;
        document.body.style.paddingTop = navbarHeight + 'px';
    }
    
    // Initial update
    updatePadding();
    
    // Update on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updatePadding, 100);
    });
    
    // Update after images load
    window.addEventListener('load', updatePadding);
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader);