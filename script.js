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

    // --- 3. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.section-title, .roster-card, .gallery-item');

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

    // Initial setup: Add 'hidden' class to trigger animation start state from CSS
    // This ensures that if JS fails, the CSS default (visible) takes over.
    revealElements.forEach(el => {
        el.classList.add('hidden');
    });


    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                entry.target.classList.add('visible');
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

    // --- 6. Robust Video Autoplay & Fallback ---
    const videos = document.querySelectorAll('video');

    // Create Play Button Overlay Helper
    function addPlayOverlay(videoContainer) {
        if (videoContainer.querySelector('.play-btn-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'play-btn-overlay';
        overlay.innerHTML = `
            <div class="play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        `;

        videoContainer.appendChild(overlay);

        // On click, play and remove overlay
        overlay.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent other clicks
            const video = videoContainer.querySelector('video');
            if (video) {
                video.muted = false; // Unmute on manual interaction if desired, or keep muted
                video.play().then(() => {
                    overlay.classList.add('playing');
                    setTimeout(() => overlay.remove(), 300);
                }).catch(err => console.error("Video play failed:", err));
            }
        });
    }

    videos.forEach(video => {
        // Ensure critical attributes for mobile
        video.setAttribute('playsinline', '');
        video.muted = true;

        // Try to play
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Auto-play was prevented
                console.log('Autoplay prevented, adding fallback UI:', error);
                const container = video.closest('.media-item');
                if (container) addPlayOverlay(container);
            });
        }

        // Also check if it pauses (e.g. low power mode might pause it)
        video.addEventListener('pause', () => {
            const container = video.closest('.media-item');
            if (container && !video.seeking) { // Don't show while seeking
                addPlayOverlay(container);
            }
        });

        video.addEventListener('playing', () => {
            const container = video.closest('.media-item');
            const overlay = container?.querySelector('.play-btn-overlay');
            if (overlay) overlay.remove();
        });
    });
});
