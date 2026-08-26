/**
 * MUHAMMAD NADIR PORTFOLIO - CORE JAVASCRIPT
 * Handles Navigation, Typing Effect, Project Filtering, Modal, Counter, and Copy Toast.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR ACTIVE LINK & MOBILE DRAWER ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('text-indigo-400', 'font-bold');
        }
    });

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuBtn ? menuBtn.querySelector('i') : null;

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                }
            } else {
                mobileMenu.classList.add('hidden');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- 2. HERO TYPEWRITER EFFECT (index.html) ---
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            "Web Developer",
            "Game Scripter",
            "Hardware Repairer",
            "Tech Enthusiast"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40; 
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 90;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2200; // Hold at full text
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- 3. ANIMATED COUNTER BAR (index.html & about.html) ---
    const statCounters = document.querySelectorAll('.counter-val');
    if (statCounters.length > 0) {
        statCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || '0', 10);
            let count = 0;
            const speed = Math.max(20, Math.floor(2000 / target));
            
            const updateCount = () => {
                count++;
                counter.innerText = count;
                if (count < target) {
                    setTimeout(updateCount, speed);
                } else {
                    counter.innerText = target + '+';
                }
            };
            updateCount();
        });
    }

    // --- 4. PROJECT CATEGORY FILTER (projects.html) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // --- 5. PROJECT DETAIL MODAL (projects.html) ---
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalTags = document.getElementById('modal-tags');
        const modalVideoBtn = document.getElementById('modal-video-btn');
        const closeBtn = document.getElementById('modal-close-btn');
        const modalBg = document.getElementById('modal-bg');

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const imgSrc = card.getAttribute('data-img-src');
                const title = card.getAttribute('data-title');
                const desc = card.getAttribute('data-desc');
                const tags = card.getAttribute('data-tags') || '';
                const videoUrl = card.getAttribute('data-video-url');

                if (modalImg) modalImg.src = imgSrc;
                if (modalTitle) modalTitle.textContent = title;
                if (modalDesc) modalDesc.textContent = desc;

                // Render tags
                if (modalTags) {
                    modalTags.innerHTML = '';
                    if (tags) {
                        tags.split(',').forEach(tag => {
                            const badge = document.createElement('span');
                            badge.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700';
                            badge.textContent = tag.trim();
                            modalTags.appendChild(badge);
                        });
                    }
                }

                // Video Tutorial button (Only shows if videoUrl is set, e.g. Windows 11)
                if (modalVideoBtn) {
                    if (videoUrl && videoUrl.trim() !== "") {
                        modalVideoBtn.href = videoUrl;
                        modalVideoBtn.classList.remove('hidden');
                        modalVideoBtn.classList.add('inline-flex');
                    } else {
                        modalVideoBtn.classList.add('hidden');
                        modalVideoBtn.classList.remove('inline-flex');
                    }
                }

                modal.classList.remove('pointer-events-none', 'opacity-0');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.add('pointer-events-none', 'opacity-0');
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (modalBg) modalBg.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // --- 6. COPY EMAIL TO CLIPBOARD & TOAST (contact.html) ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast-notification');

    if (copyEmailBtn && toast) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email') || "muhamadnadir6709@gmail.com";
            
            navigator.clipboard.writeText(email).then(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3200);
            }).catch(err => {
                console.error("Failed to copy email: ", err);
            });
        });
    }
});