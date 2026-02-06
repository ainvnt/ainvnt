// ========================
// SMOOTH SCROLL BEHAVIOR
// ========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ========================
// NAVBAR ACTIVE STATE
// ========================

const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('nav-toggle');
const navbar = document.querySelector('.navbar');

function getScrollTopButton() {
    return document.querySelector('.scroll-top');
}
let lastScrollY = window.pageYOffset || 0;
const scrollDelta = 10;
const minScrollToHide = 80;

function removeActiveClass() {
    navLinks.forEach(link => link.classList.remove('active'));
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        removeActiveClass();
        link.classList.add('active');
        navToggle.checked = false;
    });
});

window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset || 0;
    const scrollDistance = Math.abs(currentScrollY - lastScrollY);

    if (navbar && scrollDistance > scrollDelta) {
        const isMenuOpen = navToggle && navToggle.checked;

        if (currentScrollY > lastScrollY && currentScrollY > minScrollToHide && !isMenuOpen) {
            navbar.classList.add('is-hidden');
        } else {
            navbar.classList.remove('is-hidden');
        }
    }

    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    const scrollTopButton = getScrollTopButton();
    if (scrollTopButton) {
        if (currentScrollY > 300) {
            scrollTopButton.classList.add('is-visible');
        } else {
            scrollTopButton.classList.remove('is-visible');
        }
    }

    lastScrollY = currentScrollY;
});

document.addEventListener('click', (event) => {
    const scrollTopButton = event.target.closest('.scroll-top');
    if (!scrollTopButton) {
        return;
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================
// CONTACT FORM VALIDATION
// ========================

const contactForm = document.querySelector('.contact-form');

if (contactForm && !contactForm.id.includes('contact-form')) {
    // Skip if this is an EmailJS-handled form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values - check if they exist first
        const name = this.querySelector('input[placeholder="Your Name"]');
        const email = this.querySelector('input[placeholder="Your Email"]');
        const subject = this.querySelector('input[placeholder="Subject"]');
        const message = this.querySelector('textarea');
        
        // Only process if we found the old-style form fields
        if (name && email && message) {
            // Simple validation
            if (!name.value.trim()) {
                alert('Please enter your name');
                return;
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                alert('Please enter a valid email');
                return;
            }
            
            if (!message.value.trim()) {
                alert('Please enter your message');
                return;
            }
            
            // Show success message
            alert('Thank you! We will get back to you soon.');
            this.reset();
        }
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================
// BUTTON INTERACTIONS
// ========================

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Add click animation
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.6)';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        if (this.style.position === 'static') {
            this.style.position = 'relative';
        }
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ========================
// SCROLL ANIMATIONS
// ========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .stat-card, .portfolio-item, .process-step').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});

// ========================
// MOBILE MENU CLOSE ON LINK CLICK
// ========================

document.querySelectorAll('.dropdown a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.checked = false;
    });
});

// ========================
// ADD RIPPLE EFFECT CSS
// ========================

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

console.log('Ainvnt Website - Modern Version Loaded');
