// ========================
// GOOGLE ANALYTICS (GA4)
// ========================

(function initGoogleAnalytics() {
    const measurementId = 'G-CC1NYMXXF8';

    if (!measurementId || window.gtag) {
        return;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    function trackPageView() {
        const pagePath = `${window.location.pathname}${window.location.search || ''}`;
        gtag('event', 'page_view', {
            page_title: document.title,
            page_path: pagePath,
            page_location: window.location.href
        });
    }

    window.trackPageView = trackPageView;
    gtag('js', new Date());
    gtag('config', measurementId, { send_page_view: false });
    trackPageView();

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gaScript);
})();

// ========================
// SMOOTH SCROLL BEHAVIOR
// ========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const isMobileNav = window.innerWidth <= 1024;
        const isDropdownToggle = this.classList.contains('nav-link') && this.closest('.dropdown');

        // On mobile/tablet, top-level dropdown links should open their menu first.
        if (isMobileNav && isDropdownToggle) {
            return;
        }

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
const dropdowns = document.querySelectorAll('.dropdown');

function getScrollTopButton() {
    return document.querySelector('.scroll-top');
}
let lastScrollY = window.pageYOffset || 0;
const scrollDelta = 10;
const minScrollToHide = 80;

function removeActiveClass() {
    navLinks.forEach(link => link.classList.remove('active'));
}

function closeDropdowns(except) {
    dropdowns.forEach(dropdown => {
        if (dropdown !== except) {
            dropdown.classList.remove('is-open');
        }
    });
}

function syncNavBodyState() {
    document.body.classList.toggle('nav-open', Boolean(navToggle && navToggle.checked));
}

if (navToggle) {
    navToggle.addEventListener('change', () => {
        syncNavBodyState();
        if (!navToggle.checked) {
            closeDropdowns();
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        const dropdownParent = link.closest('.dropdown');

        if (dropdownParent) {
            const isMobileNav = window.innerWidth <= 1024;
            if (isMobileNav) {
                event.preventDefault();
                const willOpen = !dropdownParent.classList.contains('is-open');
                closeDropdowns(dropdownParent);
                if (willOpen) {
                    dropdownParent.classList.add('is-open');
                }
            } else {
                closeDropdowns();
            }
            return;
        }

        removeActiveClass();
        link.classList.add('active');
        if (navToggle) {
            navToggle.checked = false;
            syncNavBodyState();
        }
        closeDropdowns();
    });
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown') && !event.target.closest('.nav-toggle-label')) {
        closeDropdowns();
    }
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

    const sectionNavLinks = Array.from(navLinks).filter(link => link.getAttribute('href').startsWith('#'));
    if (sectionNavLinks.length > 0) {
        sectionNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

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
// NOTE: Contact forms are now handled by EmailJS integration
// in contact.html and index.html. This section is disabled to avoid conflicts.

// const contactForm = document.querySelector('.contact-form');
// 
// if (contactForm && !contactForm.id.includes('contact-form')) {
//     // Legacy form handler - disabled
// }

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

document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle) {
            navToggle.checked = false;
            syncNavBodyState();
        }
        closeDropdowns();
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        closeDropdowns();
        if (navToggle && navToggle.checked) {
            navToggle.checked = false;
        }
    }
    syncNavBodyState();
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
