document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navigation ---
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- 2. Smooth Scrolling for Anchors ---
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

    // --- 3. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.section-title, .roster-card, .gallery-item');
    
    // Initial setup: hide them (handled in CSS for section-title, let's add for others via JS to be safe)
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Simple Parallax Effect for Hero ---
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrollVal = window.scrollY;
        // Move bg slower than scroll
        if (heroBg && scrollVal < window.innerHeight) {
            heroBg.style.transform = `scale(1.05) translateY(${scrollVal * 0.5}px)`;
        }
    });

    // --- 5. Roster Card "Tilt" Effect (Mouse Move) ---
    // A subtle 3D tilt effect for roster cards
    const cards = document.querySelectorAll('.roster-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});
