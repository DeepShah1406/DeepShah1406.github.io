// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get all words with animation
    const words = document.querySelectorAll('.word');

    // Optional: Add intersection observer for better mobile performance
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        words.forEach(word => {
            observer.observe(word);
        });
    }

    // Smooth scroll for navigation links
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

    // Close mobile navbar on link click
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: true
                });
            }
        });
    });
});

// Optional: Add mouse parallax effect for subtle interaction
document.addEventListener('mousemove', (e) => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    if (window.innerWidth > 768) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;

        if (heroTitle) {
            heroTitle.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
        }

        if (heroSubtitle) {
            heroSubtitle.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
        }
    }
});

// Reset transform on touch devices
if ('ontouchstart' in window) {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    if (heroTitle) heroTitle.style.transform = 'none';
    if (heroSubtitle) heroSubtitle.style.transform = 'none';
}