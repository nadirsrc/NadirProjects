<!-- ============================================ -->
<!-- NAVBAR — Navigasi utama website               -->
<!-- Fixed di atas, berisi logo dan menu link     -->
<!-- ke section Beranda, Simulasi, dan Motor.     -->
<!-- Pada mobile, menu bisa dibuka/tutup dengan   -->
<!-- tombol hamburger (nav-toggle).               -->
<!-- ============================================ -->
<nav class="nav-main">
    <div class="container">
        <div class="nav-inner">
            <!-- Logo website — klik untuk kembali ke halaman utama -->
            <a class="nav-logo" href="index.php">
                <span class="logo-mark">M</span>
                <span class="logo-text">MotoKredit</span>
            </a>
            
            <!-- Tombol hamburger untuk mobile — toggle class 'open' pada nav-menu -->
            <button class="nav-toggle" onclick="this.closest('.nav-inner').querySelector('.nav-menu').classList.toggle('open')">
                <span></span><span></span><span></span>
            </button>

            <!-- Menu navigasi — link ke masing-masing section -->
            <div class="nav-menu">
                <a href="index.php#beranda">Beranda</a>
                <a href="index.php#simulasi">Simulasi</a>
                <a href="index.php#motor">Motor</a>
            </div>
        </div>
    </div>
</nav>