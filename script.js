const setupMobileNav = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');

    if (!menuToggle || !siteNav) {
        return;
    }

    const setExpanded = (isOpen) => {
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        siteNav.classList.toggle('open', isOpen);
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setExpanded(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            setExpanded(false);
        }
    });
};

const setupRevealObserver = () => {
    const revealItems = document.querySelectorAll('.reveal');

    if (!revealItems.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                activeObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -8% 0px'
        }
    );

    revealItems.forEach((item) => observer.observe(item));
};

const setupCounters = () => {
    const counters = document.querySelectorAll('.counter');

    if (!counters.length) {
        return;
    }

    const animateCounter = (counter) => {
        const target = Number(counter.dataset.target || 0);
        const duration = 1300;
        const start = performance.now();

        const frame = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            counter.textContent = value.toString();

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    };

    if (!('IntersectionObserver' in window)) {
        counters.forEach(animateCounter);
        return;
    }

    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                activeObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.65 }
    );

    counters.forEach((counter) => observer.observe(counter));
};

const setupCursorGlow = () => {
    const cursorGlow = document.querySelector('.cursor-glow');

    if (!cursorGlow || !window.matchMedia('(pointer: fine)').matches) {
        return;
    }

    document.body.classList.add('pointer-ready');

    window.addEventListener(
        'pointermove',
        (event) => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
        },
        { passive: true }
    );
};

const setupParallax = () => {
    const nodes = document.querySelectorAll('[data-parallax]');

    if (!nodes.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const updateParallax = () => {
        const offset = window.scrollY;

        nodes.forEach((node) => {
            const speed = Number(node.dataset.parallax || 12);
            node.style.setProperty('--parallax-offset', `${offset / speed}px`);
        });
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
};

const setupTiltCards = () => {
    if (!window.matchMedia('(pointer: fine)').matches) {
        return;
    }

    const cards = document.querySelectorAll('.tilt');

    cards.forEach((card) => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';

        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -8;
            const rotateY = ((x / rect.width) - 0.5) * 10;

            card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
};

const setupHeroParticles = () => {
    const host = document.querySelector('.hero-particles');

    if (!host) {
        return;
    }

    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--warning)'];

    for (let index = 0; index < 24; index += 1) {
        const particle = document.createElement('span');
        const size = 4 + Math.random() * 8;
        const delay = Math.random() * 12;
        const duration = 12 + Math.random() * 14;
        const left = Math.random() * 100;
        const opacity = 0.2 + Math.random() * 0.5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.className = 'particle';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.opacity = opacity.toString();
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--delay', `${delay}s`);
        particle.style.setProperty('--particle-color', color);

        host.appendChild(particle);
    }
};

const setCurrentYear = () => {
    document.querySelectorAll('#current-year').forEach((yearNode) => {
        yearNode.textContent = new Date().getFullYear().toString();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    setupMobileNav();
    setupRevealObserver();
    setupCounters();
    setupCursorGlow();
    setupParallax();
    setupTiltCards();
    setupHeroParticles();
});
