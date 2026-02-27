<!-- ============================================ -->
<!-- FOOTER — Bagian bawah website                 -->
<!-- Berisi logo, deskripsi singkat, link menu,   -->
<!-- link sosial media, dan copyright.            -->
<!-- Tahun copyright otomatis pakai PHP date().   -->
<!-- ============================================ -->
<footer class="site-footer">
    <div class="container">
        <div class="footer-inner">
            <!-- Brand/logo dan deskripsi singkat website -->
            <div class="footer-brand">
                <a href="index.php" class="footer-logo">
                    <span class="logo-mark">M</span>
                    <span>MotoKredit</span>
                </a>
                <p>Simulasi kredit motor online. Hitung angsuran, bandingkan harga, dan temukan motor impianmu.</p>
            </div>
            <!-- Link navigasi footer -->
            <div class="footer-links">
                <!-- Kolom menu: link ke section utama -->
                <div class="footer-col">
                    <h4>Menu</h4>
                    <a href="index.php#beranda">Beranda</a>
                    <a href="index.php#simulasi">Simulasi</a>
                    <a href="index.php#motor">Motor</a>
                </div>
                <!-- Kolom sosial media -->
                <div class="footer-col">
                    <h4>Sosial</h4>
                    <a href="#">Instagram</a>
                    <a href="#">Twitter</a>
                    <a href="#">YouTube</a>
                </div>
            </div>
        </div>
        <!-- Copyright — tahun otomatis menggunakan PHP date('Y') -->
        <div class="footer-bottom">
            <p>&copy; <?= date('Y') ?> MotoKredit. All rights reserved.</p>
        </div>
    </div>
</footer>