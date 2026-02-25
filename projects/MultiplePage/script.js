document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 2. TYPING EFFECT (Cuma jalan kalo elemennya ada/di index.html) ---
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = ["Web Developer", "Game Scripter", "Tech Enthusiast"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; 
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Nunggu pas kalimat selesai
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- 3. MODAL PROJECTS (Cuma jalan di projects.html) ---
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalVideoBtn = document.getElementById('modal-video-btn');
        const closeBtn = document.getElementById('modal-close-btn');
        const modalBg = document.getElementById('modal-bg');

        // Buka Modal
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const imgSrc = card.getAttribute('data-img-src');
                const title = card.getAttribute('data-title');
                const desc = card.getAttribute('data-desc');
                const videoUrl = card.getAttribute('data-video-url');

                modalImg.src = imgSrc;
                modalTitle.textContent = title;
                modalDesc.textContent = desc;

                if (videoUrl && videoUrl.trim() !== "") {
                    modalVideoBtn.href = videoUrl;
                    modalVideoBtn.classList.remove('hidden');
                    modalVideoBtn.classList.add('inline-block');
                } else {
                    modalVideoBtn.classList.add('hidden');
                    modalVideoBtn.classList.remove('inline-block');
                }

                modal.classList.remove('pointer-events-none', 'opacity-0');
                document.body.style.overflow = 'hidden'; // Stop scroll belakang
            });
        });

        // Tutup Modal
        const closeModal = () => {
            modal.classList.add('pointer-events-none', 'opacity-0');
            document.body.style.overflow = 'auto';
        };

        closeBtn.addEventListener('click', closeModal);
        modalBg.addEventListener('click', closeModal);
        
        // Tutup pake tombol ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }
});