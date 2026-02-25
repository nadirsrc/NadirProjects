// Inisialisasi AOS (Animate on Scroll)
AOS.init({
    duration: 800, // Durasi animasi
    once: false, // Animasi berulang setiap kali scroll
    mirror: true, // Animasi saat scroll ke atas juga
});

// Fungsionalitas untuk Tombol Hamburger Menu
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Menutup menu mobile setelah link di-klik
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
});
