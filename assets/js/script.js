// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    }
});

// Animate outline
function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
    }

    requestAnimationFrame(animateOutline);
}

if (cursorOutline) {
    animateOutline();
}

// Cursor hover effect
const interactiveElements = document.querySelectorAll('a, button, .work-image, input, textarea');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorOutline) {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
        }
        if (cursorDot) {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }
    });

    el.addEventListener('mouseleave', () => {
        if (cursorOutline) {
            cursorOutline.style.width = '30px';
            cursorOutline.style.height = '30px';
        }
        if (cursorDot) {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
});

// ===== MOBILE MENU TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== THEME TOGGLE (DARK/LIGHT MODE) =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== LANGUAGE TOGGLE =====
const langToggle = document.getElementById('langToggle');
const langText = document.querySelector('.lang-text');

let currentLang = localStorage.getItem('language') || 'sk';

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-en][data-sk]');

    elements.forEach(element => {
        const text = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-sk');

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });

    if (langText) {
        langText.textContent = lang.toUpperCase();
    }

    document.documentElement.setAttribute('lang', lang);
}

updateLanguage(currentLang);

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'sk' ? 'en' : 'sk';
        updateLanguage(currentLang);
        localStorage.setItem('language', currentLang);
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#' || href === '#home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        }
    });
});

// ===== NAVIGATION SCROLL EFFECT =====
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.padding = '1rem 0';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    } else {
        nav.style.padding = '2rem 0';
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('[data-aos-delay]').forEach(el => {
    const delay = el.getAttribute('data-aos-delay');
    el.style.transitionDelay = `${delay}ms`;
});

// ===== EMAILJS FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Zmena textu tlačidla počas odosielania
        const sendingMessage = currentLang === 'en'
            ? '<span>Sending...</span>'
            : '<span>Odosielam...</span>';

        submitButton.innerHTML = sendingMessage;
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';

        emailjs.sendForm('service_8rzno8w', 'template_uujii2h', contactForm)
            .then(() => {
                // Úspešné odoslanie
                const successMessage = currentLang === 'en'
                    ? '<span>Sent successfully ✓</span>'
                    : '<span>Úspešne odoslané ✓</span>';

                submitButton.innerHTML = successMessage;
                submitButton.style.background = '#22C55E';
                submitButton.style.opacity = '1';

                // Reset formulára
                contactForm.reset();

                // Zobrazenie success notifikácie
                showNotification(
                    currentLang === 'en' 
                        ? 'Message sent successfully!' 
                        : 'Správa bola úspešne odoslaná!',
                    'success'
                );

                // Obnova pôvodného stavu tlačidla po 3 sekundách
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    submitButton.style.opacity = '';
                }, 3000);
            })
            .catch((error) => {
                // Chyba pri odosielaní
                console.error('EmailJS Error:', error);

                const errorMessage = currentLang === 'en'
                    ? '<span>Failed to send ✗</span>'
                    : '<span>Nepodarilo sa odoslať ✗</span>';

                submitButton.innerHTML = errorMessage;
                submitButton.style.background = '#EF4444';
                submitButton.style.opacity = '1';

                // Zobrazenie error notifikácie
                showNotification(
                    currentLang === 'en' 
                        ? 'Failed to send message. Please try again.' 
                        : 'Nepodarilo sa odoslať správu. Skúste to prosím znova.',
                    'error'
                );

                // Obnova pôvodného stavu tlačidla po 3 sekundách
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    submitButton.style.opacity = '';
                }, 3000);
            });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Odstránenie existujúcej notifikácie
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Vytvorenie novej notifikácie
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Štýly pre notifikáciu
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#22C55E' : '#EF4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Automatické odstránenie po 5 sekundách
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// CSS animácie pre notifikácie
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PARALLAX EFFECT ON HERO =====
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

if (hero && heroContent) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.15;

        if (scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroContent.style.opacity = Math.max(0.5, 1 - (scrolled / window.innerHeight * 0.7));
        }
    });
}

// ===== WORK ITEMS HOVER EFFECT =====
const workItems = document.querySelectorAll('.work-item');

workItems.forEach(item => {
    const workImage = item.querySelector('.work-image');

    if (workImage) {
        workImage.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        item.addEventListener('mouseenter', () => {
            workImage.style.transform = 'scale(1.03)';
        });

        item.addEventListener('mouseleave', () => {
            workImage.style.transform = 'scale(1)';
        });
    }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 50);
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-bg);
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    z-index: 999;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-3px)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0)';
});